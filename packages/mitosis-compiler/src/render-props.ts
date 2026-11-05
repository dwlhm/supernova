import ts from 'typescript';

export interface ObjectField {
  name: string;
  type: 'string' | 'number' | 'boolean';
}

export interface SynthesizableArrayProp {
  name: string;
  isPrimitive: boolean;
  primitiveType?: 'string' | 'number';
  fields?: ObjectField[];
  fixtureA: any[];
  fixtureB: any[];
}

export interface UnionProp {
  name: string;
  values: string[];
}

const FIXTURES = {
  A: { count: 3, nums: [10, 20, 30], bools: [true, false, true] },
  B: { count: 5, nums: [7, 55, 13, 90, 41], bools: [false, true, false, true, false] },
} as const;

function createFixture(
  kind: 'A' | 'B',
  propName: string,
  fields?: ObjectField[],
  primitiveType?: 'string' | 'number'
): any[] {
  const { count, nums, bools } = FIXTURES[kind];
  if (primitiveType === 'string') return Array.from({ length: count }, (_, i) => `${kind}-${propName}-${i + 1}`);
  if (primitiveType === 'number') return nums.slice(0, count);
  if (!fields || fields.length === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const item: Record<string, any> = {};
    for (const field of fields) {
      if (field.type === 'string') item[field.name] = `${kind}-${field.name}-${i + 1}`;
      else if (field.type === 'number') item[field.name] = nums[i];
      else if (field.type === 'boolean') item[field.name] = bools[i];
    }
    return item;
  });
}

function getUnionValues(
  typeNode: ts.TypeNode,
  sourceFile: ts.SourceFile,
  typeAliasMap: Map<string, ts.TypeAliasDeclaration>
): string[] | null {
  if (ts.isTypeReferenceNode(typeNode)) {
    const alias = typeAliasMap.get(typeNode.typeName.getText(sourceFile));
    if (alias) return getUnionValues(alias.type, sourceFile, typeAliasMap);
  }
  if (!ts.isUnionTypeNode(typeNode)) return null;
  const nonNull = typeNode.types.filter(
    (t) =>
      t.kind !== ts.SyntaxKind.UndefinedKeyword &&
      t.kind !== ts.SyntaxKind.NullKeyword &&
      t.kind !== ts.SyntaxKind.VoidKeyword
  );
  const literals: string[] = [];
  for (const t of nonNull) {
    if (ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal)) {
      literals.push(t.literal.text);
    } else {
      return null;
    }
  }
  return literals.length >= 2 ? literals : null;
}

function getArrayElementType(typeNode: ts.TypeNode, sourceFile: ts.SourceFile): ts.TypeNode | null {
  if (ts.isArrayTypeNode(typeNode)) return typeNode.elementType;
  if (
    ts.isTypeReferenceNode(typeNode) &&
    typeNode.typeName.getText(sourceFile) === 'Array' &&
    typeNode.typeArguments?.length === 1
  ) {
    return typeNode.typeArguments[0]!;
  }
  return null;
}

function getFieldPrimitiveType(
  typeNode: ts.TypeNode,
  sourceFile: ts.SourceFile,
  typeAliasMap: Map<string, ts.TypeAliasDeclaration>
): 'string' | 'number' | 'boolean' | null {
  if (typeNode.kind === ts.SyntaxKind.StringKeyword) return 'string';
  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) return 'number';
  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) return 'boolean';
  if (ts.isUnionTypeNode(typeNode)) {
    const nonNull = typeNode.types.filter(
      (t) =>
        t.kind !== ts.SyntaxKind.UndefinedKeyword &&
        t.kind !== ts.SyntaxKind.NullKeyword &&
        t.kind !== ts.SyntaxKind.VoidKeyword
    );
    if (nonNull.length === 1 && nonNull[0]) {
      return getFieldPrimitiveType(nonNull[0], sourceFile, typeAliasMap);
    }
  }
  if (ts.isTypeReferenceNode(typeNode)) {
    const alias = typeAliasMap.get(typeNode.typeName.getText(sourceFile));
    if (alias) return getFieldPrimitiveType(alias.type, sourceFile, typeAliasMap);
  }
  return null;
}

export function extractPropsInfo(
  source: string,
  componentName: string
): {
  unionProps: UnionProp[];
  synthesizableArrayProps: SynthesizableArrayProp[];
} {
  const sourceFile = ts.createSourceFile('temp.lite.tsx', source, ts.ScriptTarget.Latest, true);
  const interfaceMap = new Map<string, ts.InterfaceDeclaration>();
  const typeAliasMap = new Map<string, ts.TypeAliasDeclaration>();

  for (const stmt of sourceFile.statements) {
    if (ts.isInterfaceDeclaration(stmt)) interfaceMap.set(stmt.name.text, stmt);
    else if (ts.isTypeAliasDeclaration(stmt)) typeAliasMap.set(stmt.name.text, stmt);
  }

  const getSigsFromType = (typeNode?: ts.TypeNode): ts.PropertySignature[] => {
    if (!typeNode) return [];
    if (ts.isTypeLiteralNode(typeNode)) return typeNode.members.filter(ts.isPropertySignature);
    if (ts.isTypeReferenceNode(typeNode)) {
      const name = typeNode.typeName.getText(sourceFile);
      const iface = interfaceMap.get(name);
      if (iface) return getSigsFromIface(iface);
      const alias = typeAliasMap.get(name);
      if (alias) return getSigsFromType(alias.type);
    }
    if (ts.isIntersectionTypeNode(typeNode)) {
      return typeNode.types.flatMap((t) => getSigsFromType(t));
    }
    return [];
  };

  const getSigsFromIface = (iface: ts.InterfaceDeclaration): ts.PropertySignature[] => {
    const res: ts.PropertySignature[] = [];
    for (const clause of iface.heritageClauses || []) {
      for (const t of clause.types) {
        const parentName = t.expression.getText(sourceFile);
        const parentIface = interfaceMap.get(parentName);
        if (parentIface) res.push(...getSigsFromIface(parentIface));
        const parentAlias = typeAliasMap.get(parentName);
        if (parentAlias) res.push(...getSigsFromType(parentAlias.type));
      }
    }
    for (const member of iface.members) {
      if (ts.isPropertySignature(member)) res.push(member);
    }
    return res;
  };

  let propSignatures = resolveComponentPropSignatures(
    sourceFile,
    componentName,
    interfaceMap,
    typeAliasMap,
    getSigsFromType,
    getSigsFromIface
  );

  const unionProps: UnionProp[] = [];
  const synthesizableArrayProps: SynthesizableArrayProp[] = [];

  for (const sig of propSignatures) {
    if (!sig.type) continue;
    const propName = sig.name.getText(sourceFile).replace(/['"]/g, '');
    const unionVals = getUnionValues(sig.type, sourceFile, typeAliasMap);
    if (unionVals && unionVals.length >= 2) {
      unionProps.push({ name: propName, values: Array.from(new Set(unionVals)) });
    }
    const elemType = getArrayElementType(sig.type, sourceFile);
    if (!elemType) continue;
    if (elemType.kind === ts.SyntaxKind.StringKeyword || elemType.kind === ts.SyntaxKind.NumberKeyword) {
      const pType = elemType.kind === ts.SyntaxKind.StringKeyword ? 'string' : 'number';
      synthesizableArrayProps.push({
        name: propName,
        isPrimitive: true,
        primitiveType: pType,
        fixtureA: createFixture('A', propName, undefined, pType),
        fixtureB: createFixture('B', propName, undefined, pType),
      });
      continue;
    }
    const fields: ObjectField[] = [];
    for (const m of getSigsFromType(elemType)) {
      if (!m.type) continue;
      const fieldType = getFieldPrimitiveType(m.type, sourceFile, typeAliasMap);
      if (fieldType) fields.push({ name: m.name.getText(sourceFile).replace(/['"]/g, ''), type: fieldType });
    }
    if (fields.length > 0) {
      synthesizableArrayProps.push({
        name: propName,
        isPrimitive: false,
        fields,
        fixtureA: createFixture('A', propName, fields),
        fixtureB: createFixture('B', propName, fields),
      });
    }
  }
  return { unionProps, synthesizableArrayProps };
}

function resolveComponentPropSignatures(
  sourceFile: ts.SourceFile,
  componentName: string,
  interfaceMap: Map<string, ts.InterfaceDeclaration>,
  typeAliasMap: Map<string, ts.TypeAliasDeclaration>,
  getSigsFromType: (t?: ts.TypeNode) => ts.PropertySignature[],
  getSigsFromIface: (i: ts.InterfaceDeclaration) => ts.PropertySignature[]
): ts.PropertySignature[] {
  for (const stmt of sourceFile.statements) {
    if (ts.isFunctionDeclaration(stmt)) {
      const isDefault = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      if ((isDefault || stmt.name?.text === componentName) && stmt.parameters[0]?.type) {
        const sigs = getSigsFromType(stmt.parameters[0].type);
        if (sigs.length > 0) return sigs;
      }
    }
  }
  const exactName = `${componentName}Props`;
  if (interfaceMap.has(exactName)) return getSigsFromIface(interfaceMap.get(exactName)!);
  if (typeAliasMap.has(exactName)) return getSigsFromType(typeAliasMap.get(exactName)!.type);
  for (const [name, iface] of interfaceMap) if (name.endsWith('Props')) return getSigsFromIface(iface);
  for (const [name, alias] of typeAliasMap) if (name.endsWith('Props')) return getSigsFromType(alias.type);
  return [];
}
