import { ClassNamesConfig } from "react-select"

import { cn } from "@/lib/utils/utils"

const MULTISELECT_CLASSNAMES: ClassNamesConfig = {
  control: (state) =>
    cn(
      "btn-default bg-primary/60 before:bg-primary/20 hover:bg-primary/40 h-[40px] min-w-[215px] border-0 shadow-none after:content-none hover:border-0"
    ),
  valueContainer: (state) => cn("text-primary px-4"),
  indicatorsContainer: (state) => cn("text-primary"),
  input: (state) => cn("text-white"),

  multiValue: (state) => cn("overflow-hidden rounded-md bg-white/[0.05]"),
  multiValueLabel: (state) => cn("text-accent-foreground pr-2 font-semibold"),
  multiValueRemove: (state) => cn("bg-white/[0.05] text-white opacity-70"),

  menu: (state) => cn("dropdown bg-primary/60 z-10 w-[250px] px-2 shadow-md"),
  menuList: (state) => cn("text-primary py-2"),
  menuPortal: (state) => cn("text-primary"),
  option: ({ isDisabled, isFocused, isSelected }) =>
    cn(
      "cursor-pointer rounded-lg p-2 font-medium",
      isFocused
        ? "text-accent-foreground bg-white/[0.05]"
        : "bg-transparent text-white"
    ),

  clearIndicator: (state) => cn("text-white"),
  dropdownIndicator: (state) => cn("text-white"),
  indicatorSeparator: (state) => cn("bg-white/20"),

  placeholder: (state) => cn("text-white/50"),
  singleValue: (state) => cn("text-primary bg-white/[0.05]"),

  container: (state) => cn(""),
  group: (state) => cn("text-primary bg-primary/60"),
  groupHeading: (state) => cn("text-primary"),
  loadingIndicator: (state) => cn("text-primary"),
  loadingMessage: (state) => cn("text-white"),
  noOptionsMessage: (state) => cn("text-white"),
}

export default MULTISELECT_CLASSNAMES
