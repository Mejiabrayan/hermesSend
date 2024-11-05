export const inputContainerStyles = `relative
  before:pointer-events-none focus-within:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:ring-2 before:ring-blue-500/20 before:transition
  after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 focus-within:after:shadow-blue-500/100 dark:focus-within:after:shadow-blue-500/20 after:transition`;

export const labelStyles = `has-[+input:not(:placeholder-shown)]:top-0
  has-[+input:not(:placeholder-shown)]:-translate-y-1/2 
  has-[+input:not(:placeholder-shown)]:text-base 
  has-[+input:not(:placeholder-shown)]:text-white/70 
  origin-start 
  absolute 
  top-1/2 
  z-20
  block 
  -translate-y-1/2 
  cursor-text 
  text-sm 
  text-white/70 
  transition-all 
  group-focus-within:top-0 
  group-focus-within:-translate-y-1/2 
  group-focus-within:text-xs 
  group-focus-within:text-white/70 `;

  // fix clipping
export const labelSpanStyles = `relative px-2
  after:content-[''] after:block after:absolute after:left-0 after:right-0
  after:top-[calc(50%-1px)] after:h-[2px] after:-z-10
  after:bg-transparent after:transition`;

export const inputStyles = `relative text-sm w-full text-neutral-200 bg-zinc-900 placeholder:text-white  px-3.5 py-2 rounded-lg border border-black/5 shadow-input shadow-black/5 dark:shadow-black/10 !outline-none`;

export const dividerStyles = `relative flex items-center py-5 text-xs uppercase before:flex-1 before:border-t before:border-zinc-700 after:flex-1 after:border-t after:border-zinc-700`;

export const buttonStyles = `relative text-sm w-full dark:text-neutral-200 bg-white dark:bg-gradient-to-b dark:from-zinc-950 dark:to-black px-3.5 py-2 rounded-lg border border-black/5 shadow-input shadow-black/5 dark:shadow-black/10 
  before:pointer-events-none focus-visible:before:opacity-100 before:opacity-0 before:absolute before:-inset-1 before:rounded-[11px] before:border before:border-blue-500 before:ring-2 before:ring-blue-500/20 before:transition
  after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-white/5 focus-visible:after:shadow-blue-500/100 dark:focus-visible:after:shadow-blue-500/20 after:transition
  disabled:opacity-50 disabled:cursor-not-allowed
  active:scale-[0.98] active:before:opacity-100 active:transition-transform
  transform duration-100 hover:brightness-110
  disabled:active:scale-100 disabled:hover:brightness-100
`;
