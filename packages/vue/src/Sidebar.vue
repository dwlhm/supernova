<template>
  <div
    :id="id"
    :aria-describedby="ariaDescribedby"
    :class="
      'flex flex-col pb-2 bg-background-page border border-[#e5e5e5]' +
      (className ? ' ' + className : '')
    "
  >
    <div class="flex flex-col gap-2 px-2 py-4 w-full">
      <div class="flex flex-row gap-2 items-center">
        <div><div class="bg-[#c53300]"></div></div>
        <template v-if="showWordmark !== false">
          <div class="bg-[#0f0e0f]"></div>
        </template>
      </div>
    </div>
    <div class="flex flex-col gap-2 items-center w-full flex-1">
      <div class="flex flex-col p-2 w-full flex-1">
        <div class="flex flex-row gap-2 px-2 items-center w-full">
          <p class="text-xs font-medium text-[#525252]">
            {{ management ?? "Management" }}
          </p>
        </div>
        <div class="flex flex-col w-full">
          <div class="flex flex-col gap-2 justify-center rounded-md w-full">
            <button
              type="button"
              class="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors"
              @click="async (event) => onClick?.()"
            >
              <template v-if="showLeadingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>

              <template v-if="showLabel !== false">
                <p class="text-sm font-normal text-[#0a0a0a]">
                  {{ label ?? "Menu" }}
                </p>
              </template>

              <template v-if="showBadge !== false">
                <div
                  class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                >
                  <div class="flex flex-row gap-3 justify-center items-center">
                    <p class="text-sm font-normal text-center text-[#fafafa]">
                      {{ badgeLabel ?? "New" }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="showTrailingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>
            </button>
          </div>
          <div class="flex flex-col gap-2 justify-center rounded-md w-full">
            <button
              type="button"
              class="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors"
              @click="async (event) => onClick?.()"
            >
              <template v-if="showLeadingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>

              <template v-if="showLabel !== false">
                <p class="text-sm font-normal text-[#0a0a0a]">
                  {{ label ?? "Menu" }}
                </p>
              </template>

              <template v-if="showBadge !== false">
                <div
                  class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                >
                  <div class="flex flex-row gap-3 justify-center items-center">
                    <p class="text-sm font-normal text-center text-[#fafafa]">
                      {{ badgeLabel ?? "New" }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="showTrailingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>
            </button>
          </div>
          <div class="flex flex-col gap-2 justify-center rounded-md w-full">
            <button
              type="button"
              class="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors"
              @click="async (event) => onClick?.()"
            >
              <template v-if="showLeadingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>

              <template v-if="showLabel !== false">
                <p class="text-sm font-normal text-[#0a0a0a]">
                  {{ label ?? "Menu" }}
                </p>
              </template>

              <template v-if="showBadge !== false">
                <div
                  class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                >
                  <div class="flex flex-row gap-3 justify-center items-center">
                    <p class="text-sm font-normal text-center text-[#fafafa]">
                      {{ badgeLabel ?? "New" }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="showTrailingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>
            </button>
          </div>
          <div class="flex flex-col w-full">
            <div class="flex flex-col gap-1 rounded-xl bg-[#f5f5f5] w-full">
              <button
                type="button"
                class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                @click="async (event) => onClick?.()"
              >
                <template v-if="showLeadingIcon !== false">
                  <div><div class="border border-[#0a0a0a]"></div></div>
                </template>

                <template v-if="showLabel !== false">
                  <p class="text-sm font-normal text-[#0a0a0a]">
                    {{ label ?? "Menu" }}
                  </p>
                </template>

                <template v-if="showBadge !== false">
                  <div
                    class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                  >
                    <div
                      class="flex flex-row gap-3 justify-center items-center"
                    >
                      <p class="text-sm font-normal text-center text-[#fafafa]">
                        {{ badgeLabel ?? "New" }}
                      </p>
                    </div>
                  </div>
                </template>

                <template v-if="showTrailingIcon !== false">
                  <div><div class="border border-[#0a0a0a]"></div></div>
                </template>
              </button>
            </div>
            <div class="flex flex-row px-4 w-full">
              <div
                class="flex flex-col gap-1 px-3 py-1 border border-[#e5e5e5] w-full flex-1"
              >
                <div class="flex flex-col w-full">
                  <div class="flex flex-col gap-3 rounded-xl w-full">
                    <button
                      type="button"
                      class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                      @click="async (event) => onClick?.()"
                    >
                      <template v-if="showLeadingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>

                      <template v-if="showLabel !== false">
                        <p class="text-sm font-normal text-[#0a0a0a]">
                          {{ label ?? "Menu" }}
                        </p>
                      </template>

                      <template v-if="showBadge !== false">
                        <div
                          class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                        >
                          <div
                            class="flex flex-row gap-3 justify-center items-center"
                          >
                            <p
                              class="text-sm font-normal text-center text-[#fafafa]"
                            >
                              {{ badgeLabel ?? "New" }}
                            </p>
                          </div>
                        </div>
                      </template>

                      <template v-if="showTrailingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>
                    </button>
                  </div>
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex flex-col gap-3 rounded-xl w-full">
                    <button
                      type="button"
                      class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                      @click="async (event) => onClick?.()"
                    >
                      <template v-if="showLeadingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>

                      <template v-if="showLabel !== false">
                        <p class="text-sm font-normal text-[#0a0a0a]">
                          {{ label ?? "Menu" }}
                        </p>
                      </template>

                      <template v-if="showBadge !== false">
                        <div
                          class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                        >
                          <div
                            class="flex flex-row gap-3 justify-center items-center"
                          >
                            <p
                              class="text-sm font-normal text-center text-[#fafafa]"
                            >
                              {{ badgeLabel ?? "New" }}
                            </p>
                          </div>
                        </div>
                      </template>

                      <template v-if="showTrailingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>
                    </button>
                  </div>
                </div>
                <div class="flex flex-col w-full">
                  <div class="flex flex-col gap-3 rounded-xl w-full">
                    <button
                      type="button"
                      class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                      @click="async (event) => onClick?.()"
                    >
                      <template v-if="showLeadingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>

                      <template v-if="showLabel !== false">
                        <p class="text-sm font-normal text-[#0a0a0a]">
                          {{ label ?? "Menu" }}
                        </p>
                      </template>

                      <template v-if="showBadge !== false">
                        <div
                          class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                        >
                          <div
                            class="flex flex-row gap-3 justify-center items-center"
                          >
                            <p
                              class="text-sm font-normal text-center text-[#fafafa]"
                            >
                              {{ badgeLabel ?? "New" }}
                            </p>
                          </div>
                        </div>
                      </template>

                      <template v-if="showTrailingIcon !== false">
                        <div><div class="border border-[#0a0a0a]"></div></div>
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row gap-2 px-2 items-center w-full">
          <p class="text-xs font-medium text-[#525252]">
            {{ management2 ?? "Management" }}
          </p>
        </div>
        <div class="flex flex-col w-full">
          <div class="flex flex-col gap-1 rounded-xl bg-[#f5f5f5] w-full">
            <button
              type="button"
              class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
              @click="async (event) => onClick?.()"
            >
              <template v-if="showLeadingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>

              <template v-if="showLabel !== false">
                <p class="text-sm font-normal text-[#0a0a0a]">
                  {{ label ?? "Menu" }}
                </p>
              </template>

              <template v-if="showBadge !== false">
                <div
                  class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                >
                  <div class="flex flex-row gap-3 justify-center items-center">
                    <p class="text-sm font-normal text-center text-[#fafafa]">
                      {{ badgeLabel ?? "New" }}
                    </p>
                  </div>
                </div>
              </template>

              <template v-if="showTrailingIcon !== false">
                <div><div class="border border-[#0a0a0a]"></div></div>
              </template>
            </button>
          </div>
          <div class="flex flex-row px-4 w-full">
            <div
              class="flex flex-col gap-1 px-3 py-1 border border-[#e5e5e5] w-full flex-1"
            >
              <div class="flex flex-col w-full">
                <div class="flex flex-col gap-3 rounded-xl w-full">
                  <button
                    type="button"
                    class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                    @click="async (event) => onClick?.()"
                  >
                    <template v-if="showLeadingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>

                    <template v-if="showLabel !== false">
                      <p class="text-sm font-normal text-[#0a0a0a]">
                        {{ label ?? "Menu" }}
                      </p>
                    </template>

                    <template v-if="showBadge !== false">
                      <div
                        class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                      >
                        <div
                          class="flex flex-row gap-3 justify-center items-center"
                        >
                          <p
                            class="text-sm font-normal text-center text-[#fafafa]"
                          >
                            {{ badgeLabel ?? "New" }}
                          </p>
                        </div>
                      </div>
                    </template>

                    <template v-if="showTrailingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>
                  </button>
                </div>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex flex-col gap-3 rounded-xl w-full">
                  <button
                    type="button"
                    class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                    @click="async (event) => onClick?.()"
                  >
                    <template v-if="showLeadingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>

                    <template v-if="showLabel !== false">
                      <p class="text-sm font-normal text-[#0a0a0a]">
                        {{ label ?? "Menu" }}
                      </p>
                    </template>

                    <template v-if="showBadge !== false">
                      <div
                        class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                      >
                        <div
                          class="flex flex-row gap-3 justify-center items-center"
                        >
                          <p
                            class="text-sm font-normal text-center text-[#fafafa]"
                          >
                            {{ badgeLabel ?? "New" }}
                          </p>
                        </div>
                      </div>
                    </template>

                    <template v-if="showTrailingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>
                  </button>
                </div>
              </div>
              <div class="flex flex-col w-full">
                <div class="flex flex-col gap-3 rounded-xl w-full">
                  <button
                    type="button"
                    class="flex flex-row gap-2 px-2 py-3 items-center rounded-lg w-full cursor-pointer transition-colors"
                    @click="async (event) => onClick?.()"
                  >
                    <template v-if="showLeadingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>

                    <template v-if="showLabel !== false">
                      <p class="text-sm font-normal text-[#0a0a0a]">
                        {{ label ?? "Menu" }}
                      </p>
                    </template>

                    <template v-if="showBadge !== false">
                      <div
                        class="flex flex-col gap-3 px-3 py-1 justify-center items-center rounded-xl bg-[#e55514]"
                      >
                        <div
                          class="flex flex-row gap-3 justify-center items-center"
                        >
                          <p
                            class="text-sm font-normal text-center text-[#fafafa]"
                          >
                            {{ badgeLabel ?? "New" }}
                          </p>
                        </div>
                      </div>
                    </template>

                    <template v-if="showTrailingIcon !== false">
                      <div><div class="border border-[#0a0a0a]"></div></div>
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 justify-center rounded-md w-full">
          <button
            type="button"
            class="flex flex-row gap-2 px-2 py-3 justify-center items-center rounded-lg w-full cursor-pointer transition-colors"
            @click="async (event) => onClick?.()"
          >
            <template v-if="showLeadingIcon !== false">
              <div><div class="border border-[#0a0a0a]"></div></div>
            </template>

            <template v-if="showLabel !== false">
              <p class="text-sm font-normal text-[#0a0a0a]">
                {{ label ?? "Menu" }}
              </p>
            </template>

            <template v-if="showBadge !== false">
              <div
                class="flex flex-col gap-3 px-2 py-1 justify-center items-center rounded-xl bg-[#e55514]"
              >
                <div class="flex flex-row gap-3 justify-center items-center">
                  <p class="text-sm font-normal text-center text-[#fafafa]">
                    {{ badgeLabel ?? "New" }}
                  </p>
                </div>
              </div>
            </template>

            <template v-if="showTrailingIcon !== false">
              <div><div class="border border-[#0a0a0a]"></div></div>
            </template>
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-3 px-2 w-full">
        <div
          class="flex flex-row gap-2 p-2 items-center rounded-xl bg-[#fafafa] w-full"
        >
          <div class="flex flex-row justify-center items-center rounded-full">
            <template v-if="showStatus !== false">
              <div class="bg-[#22c55e] border-2 border-white"></div>
            </template>
          </div>
          <div class="flex flex-col rounded-xl w-full flex-1">
            <p class="text-sm font-semibold text-[#0a0a0a]">
              {{ name ?? "Lionel Messi" }}
            </p>
            <p class="text-xs font-normal text-[#0a0a0a]">
              {{ email ?? "messi@gmail.com" }}
            </p>
          </div>
          <div><div class="border border-[#0a0a0a]"></div></div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
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

const props = defineProps<SidebarProps>();
</script>