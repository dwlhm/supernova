export interface SidebarProps {
  brandContent?: any;
  navigationContent?: any;
  accountContent?: any;
  expanded?: boolean;
  showWordmark?: boolean;
  onClick?: (event?: any) => void;
  showLeadingIcon?: boolean;
  showLabel?: boolean;
  label?: string;
  showBadge?: boolean;
  badgeLabel?: string;
  showTrailingIcon?: boolean;
  showStatus?: boolean;
  children?: any;
  className?: string;
  id?: string;
  ariaDescribedby?: string;
  management?: string;
  management2?: string;
  name?: string;
  email?: string;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div id={props.id} aria-describedby={props.ariaDescribedby} className={"flex flex-col pb-2 bg-background-page border border-[#e5e5e5]" + (props.className ? " " + props.className : "")}>
      <div className="flex flex-col gap-2 px-2 py-4 w-full">
        <div className="flex flex-row gap-2 items-center">
          <div>
            <div className="bg-[#c53300]" />
          </div>
          {props.showWordmark !== false && (
            <div className="bg-[#0f0e0f]" />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center w-full flex-1">
        <div className="flex flex-col p-2 w-full flex-1">
          <div className="flex flex-row gap-2 px-2 items-center w-full">
            <p className="text-xs font-medium text-[#525252]">{props.management ?? "Management"}</p>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2 justify-center rounded-md w-full">
              <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors">
                {props.showLeadingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
                {props.showLabel !== false && (
                  <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                )}
                {props.showBadge !== false && (
                  <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                    <div className="flex flex-row gap-3 justify-center items-center">
                      <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                    </div>
                  </div>
                )}
                {props.showTrailingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex flex-col gap-2 justify-center rounded-md w-full">
              <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors">
                {props.showLeadingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
                {props.showLabel !== false && (
                  <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                )}
                {props.showBadge !== false && (
                  <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                    <div className="flex flex-row gap-3 justify-center items-center">
                      <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                    </div>
                  </div>
                )}
                {props.showTrailingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex flex-col gap-2 justify-center rounded-md w-full">
              <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors">
                {props.showLeadingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
                {props.showLabel !== false && (
                  <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                )}
                {props.showBadge !== false && (
                  <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                    <div className="flex flex-row gap-3 justify-center items-center">
                      <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                    </div>
                  </div>
                )}
                {props.showTrailingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-1 rounded-xl bg-[#f5f5f5] w-full">
                <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                  {props.showLeadingIcon !== false && (
                    <div>
                      <div className="border border-[#0a0a0a]" />
                    </div>
                  )}
                  {props.showLabel !== false && (
                    <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                  )}
                  {props.showBadge !== false && (
                    <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                      <div className="flex flex-row gap-3 justify-center items-center">
                        <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                      </div>
                    </div>
                  )}
                  {props.showTrailingIcon !== false && (
                    <div>
                      <div className="border border-[#0a0a0a]" />
                    </div>
                  )}
                </button>
              </div>
              <div className="flex flex-row px-4 w-full">
                <div className="flex flex-col gap-1 px-3 py-1 border border-[#e5e5e5] w-full flex-1">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-3 rounded-xl w-full">
                      <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                        {props.showLeadingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                        {props.showLabel !== false && (
                          <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                        )}
                        {props.showBadge !== false && (
                          <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                            <div className="flex flex-row gap-3 justify-center items-center">
                              <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                            </div>
                          </div>
                        )}
                        {props.showTrailingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-3 rounded-xl w-full">
                      <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                        {props.showLeadingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                        {props.showLabel !== false && (
                          <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                        )}
                        {props.showBadge !== false && (
                          <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                            <div className="flex flex-row gap-3 justify-center items-center">
                              <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                            </div>
                          </div>
                        )}
                        {props.showTrailingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-3 rounded-xl w-full">
                      <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                        {props.showLeadingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                        {props.showLabel !== false && (
                          <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                        )}
                        {props.showBadge !== false && (
                          <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                            <div className="flex flex-row gap-3 justify-center items-center">
                              <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                            </div>
                          </div>
                        )}
                        {props.showTrailingIcon !== false && (
                          <div>
                            <div className="border border-[#0a0a0a]" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 px-2 items-center w-full">
            <p className="text-xs font-medium text-[#525252]">{props.management2 ?? "Management"}</p>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-col gap-1 rounded-xl bg-[#f5f5f5] w-full">
              <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                {props.showLeadingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
                {props.showLabel !== false && (
                  <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                )}
                {props.showBadge !== false && (
                  <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                    <div className="flex flex-row gap-3 justify-center items-center">
                      <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                    </div>
                  </div>
                )}
                {props.showTrailingIcon !== false && (
                  <div>
                    <div className="border border-[#0a0a0a]" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex flex-row px-4 w-full">
              <div className="flex flex-col gap-1 px-3 py-1 border border-[#e5e5e5] w-full flex-1">
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-3 rounded-xl w-full">
                    <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                      {props.showLeadingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                      {props.showLabel !== false && (
                        <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                      )}
                      {props.showBadge !== false && (
                        <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                          <div className="flex flex-row gap-3 justify-center items-center">
                            <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                          </div>
                        </div>
                      )}
                      {props.showTrailingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-3 rounded-xl w-full">
                    <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                      {props.showLeadingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                      {props.showLabel !== false && (
                        <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                      )}
                      {props.showBadge !== false && (
                        <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                          <div className="flex flex-row gap-3 justify-center items-center">
                            <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                          </div>
                        </div>
                      )}
                      {props.showTrailingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex flex-col gap-3 rounded-xl w-full">
                    <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors">
                      {props.showLeadingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                      {props.showLabel !== false && (
                        <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
                      )}
                      {props.showBadge !== false && (
                        <div className="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                          <div className="flex flex-row gap-3 justify-center items-center">
                            <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                          </div>
                        </div>
                      )}
                      {props.showTrailingIcon !== false && (
                        <div>
                          <div className="border border-[#0a0a0a]" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center rounded-md w-full">
            <button type="button" onClick={() => props.onClick?.()} className="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors">
              {props.showLeadingIcon !== false && (
                <div>
                  <div className="border border-[#0a0a0a]" />
                </div>
              )}
              {props.showLabel !== false && (
                <p className="text-sm font-normal text-[#0a0a0a]">{props.label ?? "Menu"}</p>
              )}
              {props.showBadge !== false && (
                <div className="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]">
                  <div className="flex flex-row gap-3 justify-center items-center">
                    <p className="text-sm font-normal text-center text-[#fafafa]">{props.badgeLabel ?? "New"}</p>
                  </div>
                </div>
              )}
              {props.showTrailingIcon !== false && (
                <div>
                  <div className="border border-[#0a0a0a]" />
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-2 w-full">
          <div className="flex flex-row gap-2 p-2 items-center rounded-xl bg-[#fafafa] w-full">
            <div className="flex flex-row justify-center items-center rounded-full">
              {props.showStatus !== false && (
                <div className="bg-[#22c55e] border-2 border-white" />
              )}
            </div>
            <div className="flex flex-col rounded-xl w-full flex-1">
              <p className="text-sm font-semibold text-[#0a0a0a]">{props.name ?? "Lionel Messi"}</p>
              <p className="text-xs font-normal text-[#0a0a0a]">{props.email ?? "messi@gmail.com"}</p>
            </div>
            <div>
              <div className="border border-[#0a0a0a]" />
            </div>
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
}
