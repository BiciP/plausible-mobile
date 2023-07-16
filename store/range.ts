import { atom } from 'jotai'
import asyncAtom from './asyncAtom';
import { RefObject } from 'react';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

export const rangeAtom = asyncAtom('@range', '7days')
export const rangeModal = atom<RefObject<BottomSheetModalMethods> | null>(null)
