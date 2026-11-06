{
  description = "Supernova — Design-to-Code Multi-Framework Compiler & Documentation Platform";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [
        "aarch64-darwin"
        "x86_64-darwin"
        "aarch64-linux"
        "x86_64-linux"
      ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShellNoCC {
          name = "supernova";

          packages = with pkgs; [
            nodejs_22
            pnpm
            sqlite
            jq
            curl
            git
          ];

          env = {
            COREPACK_ENABLE_STRICT = "0";
            npm_config_manage_package_manager_versions = "false";
          };

          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            if [ -f "$PWD/.env" ]; then
              set -a
              source "$PWD/.env"
              set +a
            fi
          '';
        };
      });

      formatter = forAllSystems (pkgs: pkgs.nixfmt-rfc-style);
    };
}
