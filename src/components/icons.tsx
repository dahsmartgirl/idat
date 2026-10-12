import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowExpand01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  Bookmark02Icon,
  Cancel01Icon,
  Copy01Icon,
  FilterHorizontalIcon,
  GitForkIcon,
  GithubIcon,
  NewTwitterIcon,
  PencilEdit02Icon,
  PlusSignIcon,
  RotateLeft01Icon,
  Search01Icon,
  SearchRemoveIcon,
  SparklesIcon,
  Tick02Icon,
  Upload04Icon,
} from '@hugeicons/core-free-icons';

// The app's icon set (Hugeicons). Components keep their familiar names so call sites read the same;
// size with className (w-4 h-4), colour with text-*, and filled states with fill-* as before.
type IconProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, 'icon'>;

const defaults = { strokeWidth: 1.5 };

export const ArrowLeft = (props: IconProps) => <HugeiconsIcon icon={ArrowLeft02Icon} {...defaults} {...props} />;
export const ArrowRight = (props: IconProps) => <HugeiconsIcon icon={ArrowRight02Icon} {...defaults} {...props} />;
export const ArrowUpRight = (props: IconProps) => <HugeiconsIcon icon={ArrowUpRight01Icon} {...defaults} {...props} />;
export const Bookmark = (props: IconProps) => <HugeiconsIcon icon={Bookmark02Icon} {...defaults} {...props} />;
export const ChevronDown = (props: IconProps) => <HugeiconsIcon icon={ArrowDown01Icon} {...defaults} {...props} />;
export const Check = (props: IconProps) => <HugeiconsIcon icon={Tick02Icon} {...defaults} {...props} />;
export const ChevronLeft = (props: IconProps) => <HugeiconsIcon icon={ArrowLeft01Icon} {...defaults} {...props} />;
export const ChevronRight = (props: IconProps) => <HugeiconsIcon icon={ArrowRight01Icon} {...defaults} {...props} />;
export const Copy = (props: IconProps) => <HugeiconsIcon icon={Copy01Icon} {...defaults} {...props} />;
export const Edit = (props: IconProps) => <HugeiconsIcon icon={PencilEdit02Icon} {...defaults} {...props} />;
export const Github = (props: IconProps) => <HugeiconsIcon icon={GithubIcon} {...defaults} {...props} />;
export const GitFork = (props: IconProps) => <HugeiconsIcon icon={GitForkIcon} {...defaults} {...props} />;
export const Maximize2 = (props: IconProps) => <HugeiconsIcon icon={ArrowExpand01Icon} {...defaults} {...props} />;
export const Plus = (props: IconProps) => <HugeiconsIcon icon={PlusSignIcon} {...defaults} {...props} />;
export const RotateCcw = (props: IconProps) => <HugeiconsIcon icon={RotateLeft01Icon} {...defaults} {...props} />;
export const Search = (props: IconProps) => <HugeiconsIcon icon={Search01Icon} {...defaults} {...props} />;
export const SearchX = (props: IconProps) => <HugeiconsIcon icon={SearchRemoveIcon} {...defaults} {...props} />;
export const SlidersHorizontal = (props: IconProps) => <HugeiconsIcon icon={FilterHorizontalIcon} {...defaults} {...props} />;
export const Sparkles = (props: IconProps) => <HugeiconsIcon icon={SparklesIcon} {...defaults} {...props} />;
export const Upload = (props: IconProps) => <HugeiconsIcon icon={Upload04Icon} {...defaults} {...props} />;
export const X = (props: IconProps) => <HugeiconsIcon icon={Cancel01Icon} {...defaults} {...props} />;
export const XLogo = (props: IconProps) => <HugeiconsIcon icon={NewTwitterIcon} {...defaults} {...props} />;
