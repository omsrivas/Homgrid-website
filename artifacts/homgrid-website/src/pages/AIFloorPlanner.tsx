import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Download, Loader2, AlertCircle, RefreshCw, ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'wouter';

// ─── Design tokens — matching Homgrid palette ──────────────────────────────
const G = {
  bg:          '#EDE8E0',
  sec:         '#DDD6CB',
  dark:        '#1A1208',
  ivory:       '#1A1208',
  cream:       '#FAF8F5',
  wine:        '#BF9A48',
  gold:        '#9A7440',
  goldBorder:  'rgba(154,116,64,0.30)',
  goldDim:     'rgba(154,116,64,0.10)',
  muted:       '#6B5A4E',
  glass:       'rgba(255,252,248,0.70)',
  glassBorder: 'rgba(10,9,7,0.10)',
  wineBorder:  'rgba(191,154,72,0.42)',
  glassWine:   'rgba(191,154,72,0.10)',
};

// ─── Animation variants ───────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Floor plan data ───────────────────────────────────────────────────────
const HOUSE_STYLES = ['Modern Villa', 'Luxury Villa', 'Duplex', 'Farmhouse'] as const;
const FLOORS = ['Ground Floor', 'Second Floor', 'Third Floor'] as const;
type StyleKey = typeof HOUSE_STYLES[number];
type FloorKey = typeof FLOORS[number];

const LEGEND_MAP: Record<string, { id: number; name: string; dim: string }[]> = {
  'Modern Villa': [
    { id: 1,  name: 'CAR PARKING',           dim: "20'-0\" × 14'-0\"" },
    { id: 2,  name: 'ENTRANCE FOYER',         dim: "7'-0\" × 8'-6\""   },
    { id: 3,  name: 'FORMAL LIVING',          dim: "16'-0\" × 16'-0\"" },
    { id: 4,  name: 'FAMILY LIVING',          dim: "20'-0\" × 16'-0\"" },
    { id: 5,  name: 'DINING AREA',            dim: "14'-0\" × 14'-0\"" },
    { id: 6,  name: 'KITCHEN',                dim: "14'-0\" × 12'-0\"" },
    { id: 7,  name: 'UTILITY / WASH AREA',    dim: "10'-0\" × 6'-0\""  },
    { id: 8,  name: 'MASTER BEDROOM',         dim: "16'-0\" × 14'-0\"" },
    { id: 9,  name: 'MASTER BATHROOM',        dim: "10'-0\" × 8'-0\""  },
    { id: 10, name: 'POWDER ROOM',            dim: "5'-0\" × 5'-0\""   },
    { id: 11, name: 'POOJA ROOM',             dim: "7'-0\" × 6'-0\""   },
    { id: 12, name: 'STAIRCASE',              dim: "8'-0\" × 16'-0\""  },
    { id: 13, name: 'LIFT',                   dim: "6'-0\" × 6'-0\""   },
    { id: 14, name: 'COURTYARD / LIGHT WELL', dim: "16'-0\" × 14'-0\"" },
  ],
  'Luxury Villa': [
    { id: 1,  name: 'CAR PARKING (2 CARS)',   dim: "22'-0\" × 20'-0\"" },
    { id: 2,  name: 'GRAND ENTRANCE FOYER',   dim: "10'-0\" × 10'-0\"" },
    { id: 3,  name: 'FORMAL LIVING ROOM',     dim: "20'-0\" × 18'-0\"" },
    { id: 4,  name: 'FAMILY LOUNGE',          dim: "22'-0\" × 18'-0\"" },
    { id: 5,  name: 'FORMAL DINING',          dim: "16'-0\" × 14'-0\"" },
    { id: 6,  name: 'ISLAND KITCHEN',         dim: "18'-0\" × 14'-0\"" },
    { id: 7,  name: 'BUTLER PANTRY',          dim: "10'-0\" × 8'-0\""  },
    { id: 8,  name: 'MASTER SUITE',           dim: "20'-0\" × 18'-0\"" },
    { id: 9,  name: 'MASTER BATHROOM',        dim: "14'-0\" × 10'-0\"" },
    { id: 10, name: 'WALK-IN WARDROBE',       dim: "10'-0\" × 8'-0\""  },
    { id: 11, name: 'STUDY / HOME OFFICE',    dim: "12'-0\" × 10'-0\"" },
    { id: 12, name: 'POOJA ROOM',             dim: "8'-0\" × 7'-0\""   },
    { id: 13, name: 'STAIRCASE',              dim: "10'-0\" × 18'-0\"" },
    { id: 14, name: 'LANDSCAPED GARDEN',      dim: "20'-0\" × 18'-0\"" },
  ],
  'Duplex': [
    { id: 1,  name: 'CAR PARKING',            dim: "20'-0\" × 14'-0\"" },
    { id: 2,  name: 'ENTRANCE LOBBY',         dim: "8'-0\" × 8'-0\""   },
    { id: 3,  name: 'UNIT A - LIVING ROOM',   dim: "16'-0\" × 14'-0\"" },
    { id: 4,  name: 'UNIT B - LIVING ROOM',   dim: "16'-0\" × 14'-0\"" },
    { id: 5,  name: 'UNIT A - DINING',        dim: "12'-0\" × 10'-0\"" },
    { id: 6,  name: 'UNIT B - DINING',        dim: "12'-0\" × 10'-0\"" },
    { id: 7,  name: 'UNIT A - KITCHEN',       dim: "12'-0\" × 10'-0\"" },
    { id: 8,  name: 'UNIT B - KITCHEN',       dim: "12'-0\" × 10'-0\"" },
    { id: 9,  name: 'UNIT A - BEDROOM 1',     dim: "14'-0\" × 12'-0\"" },
    { id: 10, name: 'UNIT B - BEDROOM 1',     dim: "14'-0\" × 12'-0\"" },
    { id: 11, name: 'SHARED STAIRCASE',       dim: "8'-0\" × 14'-0\""  },
    { id: 12, name: 'UNIT A - BATHROOM',      dim: "8'-0\" × 6'-0\""   },
    { id: 13, name: 'UNIT B - BATHROOM',      dim: "8'-0\" × 6'-0\""   },
    { id: 14, name: 'COMMON GARDEN',          dim: "18'-0\" × 12'-0\"" },
  ],
  'Farmhouse': [
    { id: 1,  name: 'OPEN PARKING (2 CARS)',  dim: "24'-0\" × 16'-0\"" },
    { id: 2,  name: 'VERANDAH',              dim: "20'-0\" × 8'-0\""   },
    { id: 3,  name: 'LIVING ROOM',            dim: "20'-0\" × 18'-0\"" },
    { id: 4,  name: 'DINING ROOM',            dim: "16'-0\" × 14'-0\"" },
    { id: 5,  name: 'KITCHEN',                dim: "16'-0\" × 12'-0\"" },
    { id: 6,  name: 'PANTRY / STORAGE',       dim: "10'-0\" × 8'-0\""  },
    { id: 7,  name: 'MASTER BEDROOM',         dim: "18'-0\" × 16'-0\"" },
    { id: 8,  name: 'MASTER BATHROOM',        dim: "12'-0\" × 8'-0\""  },
    { id: 9,  name: 'BEDROOM 2',              dim: "14'-0\" × 12'-0\"" },
    { id: 10, name: 'BEDROOM 3',              dim: "14'-0\" × 12'-0\"" },
    { id: 11, name: 'COMMON BATHROOM',        dim: "8'-0\" × 7'-0\""   },
    { id: 12, name: 'POOJA ROOM',             dim: "8'-0\" × 7'-0\""   },
    { id: 13, name: 'STAIRCASE',              dim: "8'-0\" × 14'-0\""  },
    { id: 14, name: 'OPEN LAWN / GARDEN',     dim: "30'-0\" × 20'-0\"" },
  ],
};

const LEGEND_MAP_2F: Record<string, { id: number; name: string; dim: string }[]> = {
  'Modern Villa': [
    { id: 1,  name: 'MASTER BEDROOM',          dim: "16'-0\" × 14'-0\"" },
    { id: 2,  name: 'MASTER BATHROOM',          dim: "10'-0\" × 8'-0\""  },
    { id: 3,  name: 'MASTER WALK-IN WARDROBE',  dim: "8'-0\" × 6'-0\""   },
    { id: 4,  name: 'BEDROOM 2',                dim: "14'-0\" × 12'-0\"" },
    { id: 5,  name: 'BATHROOM 2',               dim: "8'-0\" × 6'-0\""   },
    { id: 6,  name: 'BEDROOM 3',                dim: "14'-0\" × 12'-0\"" },
    { id: 7,  name: 'BATHROOM 3',               dim: "8'-0\" × 6'-0\""   },
    { id: 8,  name: 'FAMILY LOUNGE',            dim: "16'-0\" × 14'-0\"" },
    { id: 9,  name: 'STUDY / HOME OFFICE',      dim: "12'-0\" × 10'-0\"" },
    { id: 10, name: 'BALCONY 1',                dim: "10'-0\" × 5'-0\""  },
    { id: 11, name: 'BALCONY 2',                dim: "10'-0\" × 5'-0\""  },
    { id: 12, name: 'STAIRCASE LANDING',        dim: "8'-0\" × 8'-0\""   },
    { id: 13, name: 'LIFT LOBBY',               dim: "6'-0\" × 6'-0\""   },
    { id: 14, name: 'STORAGE / LOFT',           dim: "8'-0\" × 6'-0\""   },
  ],
  'Luxury Villa': [
    { id: 1,  name: 'MASTER SUITE',             dim: "20'-0\" × 18'-0\"" },
    { id: 2,  name: 'MASTER BATHROOM (HIS)',     dim: "10'-0\" × 8'-0\""  },
    { id: 3,  name: 'MASTER BATHROOM (HERS)',    dim: "10'-0\" × 8'-0\""  },
    { id: 4,  name: 'MASTER WALK-IN WARDROBE',  dim: "14'-0\" × 10'-0\"" },
    { id: 5,  name: 'BEDROOM 2 (ENSUITE)',       dim: "16'-0\" × 14'-0\"" },
    { id: 6,  name: 'BATHROOM 2',               dim: "10'-0\" × 8'-0\""  },
    { id: 7,  name: 'BEDROOM 3 (ENSUITE)',       dim: "16'-0\" × 14'-0\"" },
    { id: 8,  name: 'BATHROOM 3',               dim: "10'-0\" × 8'-0\""  },
    { id: 9,  name: 'FAMILY LOUNGE',            dim: "20'-0\" × 16'-0\"" },
    { id: 10, name: 'STUDY / LIBRARY',          dim: "14'-0\" × 12'-0\"" },
    { id: 11, name: 'MASTER BALCONY',           dim: "14'-0\" × 6'-0\""  },
    { id: 12, name: 'BALCONY 2',                dim: "10'-0\" × 5'-0\""  },
    { id: 13, name: 'STAIRCASE LANDING',        dim: "10'-0\" × 10'-0\"" },
    { id: 14, name: 'LIFT LOBBY',               dim: "6'-0\" × 6'-0\""   },
  ],
  'Duplex': [
    { id: 1,  name: 'UNIT A – MASTER BEDROOM',  dim: "14'-0\" × 12'-0\"" },
    { id: 2,  name: 'UNIT B – MASTER BEDROOM',  dim: "14'-0\" × 12'-0\"" },
    { id: 3,  name: 'UNIT A – MASTER BATHROOM', dim: "8'-0\" × 6'-0\""   },
    { id: 4,  name: 'UNIT B – MASTER BATHROOM', dim: "8'-0\" × 6'-0\""   },
    { id: 5,  name: 'UNIT A – BEDROOM 2',       dim: "12'-0\" × 10'-0\"" },
    { id: 6,  name: 'UNIT B – BEDROOM 2',       dim: "12'-0\" × 10'-0\"" },
    { id: 7,  name: 'UNIT A – BATHROOM 2',      dim: "8'-0\" × 6'-0\""   },
    { id: 8,  name: 'UNIT B – BATHROOM 2',      dim: "8'-0\" × 6'-0\""   },
    { id: 9,  name: 'UNIT A – STUDY',           dim: "10'-0\" × 8'-0\""  },
    { id: 10, name: 'UNIT B – STUDY',           dim: "10'-0\" × 8'-0\""  },
    { id: 11, name: 'SHARED STAIRCASE',         dim: "8'-0\" × 14'-0\""  },
    { id: 12, name: 'UNIT A – BALCONY',         dim: "8'-0\" × 5'-0\""   },
    { id: 13, name: 'UNIT B – BALCONY',         dim: "8'-0\" × 5'-0\""   },
    { id: 14, name: 'COMMON CORRIDOR',          dim: "6'-0\" × 20'-0\""  },
  ],
  'Farmhouse': [
    { id: 1,  name: 'MASTER BEDROOM',           dim: "18'-0\" × 16'-0\"" },
    { id: 2,  name: 'MASTER BATHROOM',          dim: "12'-0\" × 8'-0\""  },
    { id: 3,  name: 'MASTER WARDROBE',          dim: "8'-0\" × 6'-0\""   },
    { id: 4,  name: 'BEDROOM 4',                dim: "14'-0\" × 12'-0\"" },
    { id: 5,  name: 'BATHROOM 4',               dim: "8'-0\" × 6'-0\""   },
    { id: 6,  name: 'BEDROOM 5',                dim: "14'-0\" × 12'-0\"" },
    { id: 7,  name: 'BATHROOM 5',               dim: "8'-0\" × 6'-0\""   },
    { id: 8,  name: 'FAMILY SITTING AREA',      dim: "16'-0\" × 14'-0\"" },
    { id: 9,  name: 'HOME OFFICE',              dim: "12'-0\" × 10'-0\"" },
    { id: 10, name: 'VERANDAH / BALCONY',       dim: "20'-0\" × 8'-0\""  },
    { id: 11, name: 'OPEN DECK',                dim: "14'-0\" × 10'-0\"" },
    { id: 12, name: 'STAIRCASE LANDING',        dim: "8'-0\" × 8'-0\""   },
    { id: 13, name: 'STORAGE ROOM',             dim: "10'-0\" × 8'-0\""  },
    { id: 14, name: 'LOFT / ATTIC ACCESS',      dim: "8'-0\" × 6'-0\""   },
  ],
};

const LEGEND_MAP_3F: Record<string, { id: number; name: string; dim: string }[]> = {
  'Modern Villa': [
    { id: 1,  name: 'BEDROOM 4',                dim: "14'-0\" × 12'-0\"" },
    { id: 2,  name: 'BATHROOM 4',               dim: "8'-0\" × 6'-0\""   },
    { id: 3,  name: 'HOME THEATRE',             dim: "18'-0\" × 14'-0\"" },
    { id: 4,  name: 'GYM / FITNESS ROOM',       dim: "16'-0\" × 12'-0\"" },
    { id: 5,  name: 'OPEN TERRACE',             dim: "20'-0\" × 16'-0\"" },
    { id: 6,  name: 'TERRACE GARDEN',           dim: "14'-0\" × 10'-0\"" },
    { id: 7,  name: 'SERVANT ROOM',             dim: "10'-0\" × 8'-0\""  },
    { id: 8,  name: 'SERVANT BATHROOM',         dim: "6'-0\" × 5'-0\""   },
    { id: 9,  name: 'MUMTY ROOM',               dim: "8'-0\" × 8'-0\""   },
    { id: 10, name: 'STAIRCASE LANDING',        dim: "8'-0\" × 8'-0\""   },
    { id: 11, name: 'LIFT LOBBY',               dim: "6'-0\" × 6'-0\""   },
    { id: 12, name: 'WATER TANK ROOM',          dim: "8'-0\" × 6'-0\""   },
    { id: 13, name: 'STORAGE ROOM',             dim: "10'-0\" × 8'-0\""  },
    { id: 14, name: 'OVERHEAD TANK AREA',       dim: "6'-0\" × 6'-0\""   },
  ],
  'Luxury Villa': [
    { id: 1,  name: 'PENTHOUSE LOUNGE',         dim: "22'-0\" × 18'-0\"" },
    { id: 2,  name: 'HOME BAR / ENTERTAINMENT', dim: "16'-0\" × 12'-0\"" },
    { id: 3,  name: 'HOME THEATRE',             dim: "20'-0\" × 16'-0\"" },
    { id: 4,  name: 'GYM / SPA ROOM',           dim: "18'-0\" × 14'-0\"" },
    { id: 5,  name: 'STEAM / SAUNA ROOM',       dim: "10'-0\" × 8'-0\""  },
    { id: 6,  name: 'TERRACE POOL AREA',        dim: "20'-0\" × 18'-0\"" },
    { id: 7,  name: 'TERRACE GARDEN',           dim: "18'-0\" × 14'-0\"" },
    { id: 8,  name: 'OUTDOOR DINING TERRACE',   dim: "16'-0\" × 12'-0\"" },
    { id: 9,  name: 'SERVANT QUARTERS',         dim: "12'-0\" × 10'-0\"" },
    { id: 10, name: 'SERVANT BATHROOM',         dim: "8'-0\" × 6'-0\""   },
    { id: 11, name: 'MUMTY / STAIR HEAD',       dim: "10'-0\" × 8'-0\""  },
    { id: 12, name: 'LIFT LOBBY',               dim: "6'-0\" × 6'-0\""   },
    { id: 13, name: 'WATER TANK ROOM',          dim: "8'-0\" × 6'-0\""   },
    { id: 14, name: 'STORAGE / UTILITY',        dim: "10'-0\" × 8'-0\""  },
  ],
  'Duplex': [
    { id: 1,  name: 'UNIT A – TERRACE',         dim: "20'-0\" × 18'-0\"" },
    { id: 2,  name: 'UNIT B – TERRACE',         dim: "20'-0\" × 18'-0\"" },
    { id: 3,  name: 'UNIT A – BEDROOM 3',       dim: "12'-0\" × 10'-0\"" },
    { id: 4,  name: 'UNIT B – BEDROOM 3',       dim: "12'-0\" × 10'-0\"" },
    { id: 5,  name: 'UNIT A – BATHROOM 3',      dim: "8'-0\" × 6'-0\""   },
    { id: 6,  name: 'UNIT B – BATHROOM 3',      dim: "8'-0\" × 6'-0\""   },
    { id: 7,  name: 'UNIT A – STUDY',           dim: "10'-0\" × 8'-0\""  },
    { id: 8,  name: 'UNIT B – STUDY',           dim: "10'-0\" × 8'-0\""  },
    { id: 9,  name: 'SHARED TERRACE GARDEN',    dim: "16'-0\" × 12'-0\"" },
    { id: 10, name: 'MUMTY ROOM',               dim: "8'-0\" × 8'-0\""   },
    { id: 11, name: 'SHARED STAIRCASE',         dim: "8'-0\" × 14'-0\""  },
    { id: 12, name: 'WATER TANK ROOM',          dim: "8'-0\" × 6'-0\""   },
    { id: 13, name: 'STORAGE',                  dim: "8'-0\" × 6'-0\""   },
    { id: 14, name: 'OVERHEAD TANK',            dim: "6'-0\" × 6'-0\""   },
  ],
  'Farmhouse': [
    { id: 1,  name: 'OPEN TERRACE',             dim: "24'-0\" × 20'-0\"" },
    { id: 2,  name: 'TERRACE GARDEN / LAWN',    dim: "20'-0\" × 16'-0\"" },
    { id: 3,  name: 'OUTDOOR LOUNGE',           dim: "18'-0\" × 14'-0\"" },
    { id: 4,  name: 'BBQ / OUTDOOR KITCHEN',    dim: "14'-0\" × 10'-0\"" },
    { id: 5,  name: 'JACUZZI / POOL AREA',      dim: "12'-0\" × 10'-0\"" },
    { id: 6,  name: 'GYM ROOM',                 dim: "14'-0\" × 12'-0\"" },
    { id: 7,  name: 'BEDROOM 6',                dim: "12'-0\" × 10'-0\"" },
    { id: 8,  name: 'BATHROOM 6',               dim: "8'-0\" × 6'-0\""   },
    { id: 9,  name: 'SERVANT ROOM',             dim: "10'-0\" × 8'-0\""  },
    { id: 10, name: 'SERVANT BATHROOM',         dim: "6'-0\" × 5'-0\""   },
    { id: 11, name: 'MUMTY / STAIR HEAD',       dim: "8'-0\" × 8'-0\""   },
    { id: 12, name: 'WATER TANK ROOM',          dim: "8'-0\" × 6'-0\""   },
    { id: 13, name: 'STORAGE ROOM',             dim: "10'-0\" × 8'-0\""  },
    { id: 14, name: 'STAIRCASE LANDING',        dim: "8'-0\" × 8'-0\""   },
  ],
};

const AREA_BY_FLOOR: Record<FloorKey, { builtUp: string; carpet: string }> = {
  'Ground Floor': { builtUp: '2100 SQ.FT.', carpet: '1725 SQ.FT.' },
  'Second Floor': { builtUp: '1950 SQ.FT.', carpet: '1600 SQ.FT.' },
  'Third Floor':  { builtUp: '1400 SQ.FT.', carpet: '1100 SQ.FT.' },
};

const ROOM_POSITIONS: Record<string, { left: number; top: number }[]> = {
  'Modern Villa': [
    { left: 74, top: 80 }, { left: 44, top: 74 }, { left: 64, top: 58 }, { left: 64, top: 40 },
    { left: 42, top: 48 }, { left: 22, top: 56 }, { left: 10, top: 70 }, { left: 18, top: 16 },
    { left: 8,  top: 28 }, { left: 36, top: 68 }, { left: 76, top: 16 }, { left: 44, top: 38 },
    { left: 52, top: 30 }, { left: 42, top: 22 },
  ],
  'Luxury Villa': [
    { left: 74, top: 82 }, { left: 44, top: 74 }, { left: 26, top: 58 }, { left: 64, top: 52 },
    { left: 44, top: 46 }, { left: 22, top: 54 }, { left: 10, top: 66 }, { left: 16, top: 14 },
    { left: 8,  top: 26 }, { left: 16, top: 36 }, { left: 34, top: 20 }, { left: 76, top: 14 },
    { left: 44, top: 36 }, { left: 44, top: 78 },
  ],
  'Duplex': [
    { left: 72, top: 80 }, { left: 44, top: 72 }, { left: 18, top: 52 }, { left: 70, top: 52 },
    { left: 18, top: 38 }, { left: 70, top: 38 }, { left: 18, top: 26 }, { left: 70, top: 26 },
    { left: 18, top: 14 }, { left: 70, top: 14 }, { left: 44, top: 44 }, { left: 8,  top: 14 },
    { left: 84, top: 14 }, { left: 44, top: 76 },
  ],
  'Farmhouse': [
    { left: 72, top: 80 }, { left: 44, top: 88 }, { left: 44, top: 50 }, { left: 44, top: 38 },
    { left: 22, top: 50 }, { left: 10, top: 60 }, { left: 16, top: 16 }, { left: 8,  top: 28 },
    { left: 62, top: 16 }, { left: 74, top: 28 }, { left: 10, top: 40 }, { left: 76, top: 16 },
    { left: 44, top: 62 }, { left: 44, top: 70 },
  ],
};

const ROOM_POSITIONS_2F: Record<string, { left: number; top: number }[]> = {
  'Modern Villa': [
    { left: 16, top: 14 }, { left: 8,  top: 26 }, { left: 18, top: 36 }, { left: 62, top: 16 },
    { left: 74, top: 28 }, { left: 62, top: 50 }, { left: 74, top: 62 }, { left: 44, top: 52 },
    { left: 44, top: 22 }, { left: 44, top: 10 }, { left: 72, top: 10 }, { left: 44, top: 42 },
    { left: 54, top: 48 }, { left: 10, top: 50 },
  ],
  'Luxury Villa': [
    { left: 16, top: 14 }, { left: 8,  top: 26 }, { left: 8,  top: 38 }, { left: 22, top: 26 },
    { left: 62, top: 16 }, { left: 74, top: 28 }, { left: 62, top: 50 }, { left: 74, top: 62 },
    { left: 44, top: 52 }, { left: 44, top: 22 }, { left: 16, top: 76 }, { left: 62, top: 10 },
    { left: 44, top: 42 }, { left: 54, top: 48 },
  ],
  'Duplex': [
    { left: 16, top: 14 }, { left: 70, top: 14 }, { left: 8,  top: 26 }, { left: 84, top: 26 },
    { left: 16, top: 38 }, { left: 70, top: 38 }, { left: 8,  top: 50 }, { left: 84, top: 50 },
    { left: 16, top: 62 }, { left: 70, top: 62 }, { left: 44, top: 44 }, { left: 16, top: 76 },
    { left: 70, top: 76 }, { left: 44, top: 62 },
  ],
  'Farmhouse': [
    { left: 16, top: 14 }, { left: 8,  top: 26 }, { left: 18, top: 36 }, { left: 62, top: 14 },
    { left: 74, top: 26 }, { left: 62, top: 48 }, { left: 74, top: 56 }, { left: 44, top: 50 },
    { left: 44, top: 26 }, { left: 44, top: 8  }, { left: 44, top: 84 }, { left: 44, top: 42 },
    { left: 10, top: 52 }, { left: 10, top: 66 },
  ],
};

const ROOM_POSITIONS_3F: Record<string, { left: number; top: number }[]> = {
  'Modern Villa': [
    { left: 74, top: 16 }, { left: 84, top: 28 }, { left: 24, top: 46 }, { left: 64, top: 46 },
    { left: 72, top: 74 }, { left: 72, top: 22 }, { left: 16, top: 76 }, { left: 8,  top: 66 },
    { left: 44, top: 82 }, { left: 44, top: 44 }, { left: 54, top: 50 }, { left: 14, top: 14 },
    { left: 10, top: 50 }, { left: 8,  top: 82 },
  ],
  'Luxury Villa': [
    { left: 44, top: 46 }, { left: 22, top: 56 }, { left: 24, top: 32 }, { left: 64, top: 32 },
    { left: 72, top: 46 }, { left: 72, top: 72 }, { left: 44, top: 78 }, { left: 18, top: 74 },
    { left: 16, top: 16 }, { left: 8,  top: 28 }, { left: 44, top: 84 }, { left: 54, top: 50 },
    { left: 8,  top: 14 }, { left: 8,  top: 50 },
  ],
  'Duplex': [
    { left: 20, top: 40 }, { left: 70, top: 40 }, { left: 14, top: 14 }, { left: 74, top: 14 },
    { left: 8,  top: 26 }, { left: 84, top: 26 }, { left: 22, top: 14 }, { left: 62, top: 14 },
    { left: 44, top: 74 }, { left: 44, top: 82 }, { left: 44, top: 44 }, { left: 8,  top: 14 },
    { left: 84, top: 14 }, { left: 44, top: 14 },
  ],
  'Farmhouse': [
    { left: 44, top: 30 }, { left: 44, top: 70 }, { left: 26, top: 50 }, { left: 64, top: 26 },
    { left: 72, top: 50 }, { left: 64, top: 60 }, { left: 16, top: 16 }, { left: 8,  top: 28 },
    { left: 16, top: 74 }, { left: 8,  top: 64 }, { left: 44, top: 84 }, { left: 8,  top: 14 },
    { left: 10, top: 50 }, { left: 44, top: 44 },
  ],
};

const VASTU = [
  { dir: 'ENTRANCE — NORTH-EAST',     note: 'Invites positive energy and prosperity.' },
  { dir: 'POOJA ROOM — NORTH-EAST',   note: 'Ideal for spiritual growth and peace.' },
  { dir: 'KITCHEN — SOUTH-EAST',      note: 'Represents fire element, good for health.' },
  { dir: 'MASTER BEDROOM — SOUTH-WEST', note: 'Ensures stability and sound sleep.' },
  { dir: 'STAIRCASE — SOUTH-WEST',    note: 'Provides strength and stability.' },
  { dir: 'OPEN SPACE — NORTH',        note: 'Brings natural light, fresh air and harmony.' },
];

function CompassRose() {
  return (
    <svg viewBox="0 0 80 80" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="none" stroke="#5a3e28" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#5a3e28" strokeWidth="0.5" />
      <polygon points="40,8 36,40 40,36 44,40" fill="#5a3e28" />
      <polygon points="40,72 36,40 40,44 44,40" fill="#c8a882" />
      <polygon points="72,40 40,36 44,40 40,44" fill="#c8a882" />
      <polygon points="8,40 40,36 36,40 40,44" fill="#c8a882" />
      <circle cx="40" cy="40" r="3" fill="#5a3e28" />
      <text x="40" y="6" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5a3e28" fontFamily="Georgia, serif">N</text>
      <text x="40" y="78" textAnchor="middle" fontSize="9" fill="#5a3e28" fontFamily="Georgia, serif">S</text>
      <text x="76" y="43" textAnchor="middle" fontSize="9" fill="#5a3e28" fontFamily="Georgia, serif">E</text>
      <text x="4"  y="43" textAnchor="middle" fontSize="9" fill="#5a3e28" fontFamily="Georgia, serif">W</text>
    </svg>
  );
}

// ─── Vastu toggle option ──────────────────────────────────────────────────
type VastuMode = 'strict' | 'flexible' | 'off';

export default function AIFloorPlanner() {
  const [dimensions, setDimensions]   = useState('');
  const [style, setStyle]             = useState<StyleKey>('Modern Villa');
  const [floor, setFloor]             = useState<FloorKey>('Ground Floor');
  const [vastuMode, setVastuMode]     = useState<VastuMode>('strict');
  const [bedrooms, setBedrooms]       = useState('3');
  const [bathrooms, setBathrooms]     = useState('2');
  const [imageUrl, setImageUrl]       = useState<string | null>(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const boardRef                      = useRef<HTMLDivElement>(null);
  const timeoutRef                    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef                    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const stopLoading = () => {
    setIsLoading(false);
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
  };

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!dimensions.trim()) {
      setError('Please enter plot dimensions (e.g., 50×70).');
      return;
    }
    setError(null);
    setIsLoading(true);
    setImageUrl(null);

    const floorDesc = floor === 'Ground Floor'
      ? 'ground floor with car parking, entrance foyer, living room, dining, kitchen, and garden'
      : floor === 'Second Floor'
      ? `upper residential floor with master bedroom suite, ${bedrooms} bedrooms, ${bathrooms} bathrooms, family lounge, study room, and balconies, no car parking no garden`
      : 'top terrace floor with open terraces, home theatre, gym, servant quarters, mumty room and water tank area, mostly open space and terraces';

    const vastuNote = vastuMode === 'strict'
      ? ', strictly Vastu compliant layout, main entrance north-east, kitchen south-east, master bedroom south-west, pooja room north-east'
      : vastuMode === 'flexible'
      ? ', loosely Vastu influenced layout'
      : '';

    const prompt = `Photorealistic architectural floor plan render, strictly top-down overhead view, ${style} house ${floor}, ${floorDesc}${vastuNote}, plot ${dimensions} feet, beige cream marble flooring inside rooms, warm sand colored interior floor tiles, dark charcoal gray thick exterior boundary walls, realistic furniture viewed from directly above: beds with pillows in bedrooms, bathroom fixtures toilet sink shower, staircase landing, ${floor === 'Ground Floor' ? 'sectional sofa with center table in living room, wooden dining table with chairs, modular kitchen counters with sink and stove, car porch with two luxury cars viewed from top, manicured green garden lawn with stepping stones and decorative plants at corners,' : floor === 'Second Floor' ? 'sectional sofa in family lounge, study desk, beds in all bedrooms, balcony railings,' : 'outdoor furniture on terrace, gym equipment, home theatre seating,'} clean sharp room boundaries, no text labels no annotations no numbers no legends no dimension lines, professional architectural visualization, soft studio lighting, ultra high resolution photorealistic 8K render, white background border margin around the plan`;

    const encoded = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 9999999);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=4096&height=4096&nologo=true&model=flux&seed=${seed}`;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setError('Generation timed out. The AI service may be busy — please try again.');
      setIsLoading(false);
      setImageUrl(null);
    }, 90000);

    setImageUrl(url);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `homgrid-floor-plan-${style.replace(/\s+/g, '-').toLowerCase()}-${floor.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
    } catch {
      setError('Download failed. Please try again.');
    }
  };

  const legend = floor === 'Second Floor'
    ? (LEGEND_MAP_2F[style] ?? LEGEND_MAP_2F['Modern Villa'])
    : floor === 'Third Floor'
    ? (LEGEND_MAP_3F[style] ?? LEGEND_MAP_3F['Modern Villa'])
    : (LEGEND_MAP[style] ?? LEGEND_MAP['Modern Villa']);

  const positions = floor === 'Second Floor'
    ? (ROOM_POSITIONS_2F[style] ?? ROOM_POSITIONS_2F['Modern Villa'])
    : floor === 'Third Floor'
    ? (ROOM_POSITIONS_3F[style] ?? ROOM_POSITIONS_3F['Modern Villa'])
    : (ROOM_POSITIONS[style] ?? ROOM_POSITIONS['Modern Villa']);

  const areaStats = AREA_BY_FLOOR[floor] ?? AREA_BY_FLOOR['Ground Floor'];

  return (
    <div style={{ minHeight: '100dvh', background: G.bg, fontFamily: 'Inter, sans-serif' }}>

      {/* ── Fixed nav bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4"
        style={{
          background: 'rgba(237,232,224,0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${G.glassBorder}`,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <ArrowLeft size={14} style={{ color: G.gold }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', letterSpacing: '0.20em', textTransform: 'uppercase', color: G.muted }}>
            Back to Homgrid
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 256 256" fill={G.wine} aria-hidden="true">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 700, color: G.ivory }}>
            Homgrid
          </span>
          <span style={{
            fontFamily: 'Inter, sans-serif', fontSize: '9px', letterSpacing: '0.24em',
            textTransform: 'uppercase', color: G.wine, fontWeight: 600,
            background: G.glassWine, border: `1px solid ${G.wineBorder}`,
            padding: '2px 8px', borderRadius: '4px',
          }}>
            AI Studio
          </span>
        </div>
      </nav>

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ paddingTop: '110px', paddingBottom: '60px', textAlign: 'center', padding: '110px 24px 60px' }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div style={{ width: '24px', height: '1px', background: G.wine }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: G.wine }}>
            Exclusive Tool
          </span>
          <div style={{ width: '24px', height: '1px', background: G.wine }} />
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 5vw, 70px)',
          fontWeight: 700,
          color: G.ivory,
          lineHeight: 1.08,
          letterSpacing: '-0.022em',
          marginBottom: '20px',
        }}>
          AI Floor Planner
        </h1>

        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 'clamp(16px, 1.4vw, 20px)',
          lineHeight: 1.8,
          color: G.muted,
          maxWidth: '520px',
          margin: '0 auto',
        }}>
          Describe your plot and requirements. Our AI generates a photorealistic architectural floor plan in moments.
        </p>
      </motion.div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 120px' }}>

        {/* ── Configuration card ── */}
        <motion.form
          onSubmit={handleGenerate}
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{
            background: G.glass,
            border: `1px solid ${G.glassBorder}`,
            borderRadius: '20px',
            padding: 'clamp(28px, 4vw, 52px)',
            marginBottom: '40px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 40px rgba(26,18,8,0.08)',
          }}
        >
          {/* Row 1: Plot size + Bedrooms + Bathrooms */}
          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>

            {/* Plot dimensions */}
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '10px' }}>
                Plot Size (feet)
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: G.gold, pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="e.g. 40×60 or 50x70"
                  value={dimensions}
                  onChange={e => setDimensions(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: '38px',
                    paddingRight: '14px',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    background: 'rgba(255,252,248,0.85)',
                    border: `1.5px solid ${G.goldBorder}`,
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: G.ivory,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = G.wine}
                  onBlur={e => e.currentTarget.style.borderColor = G.goldBorder}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '10px' }}>
                Bedrooms
              </label>
              <select
                value={bedrooms}
                onChange={e => setBedrooms(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255,252,248,0.85)',
                  border: `1.5px solid ${G.goldBorder}`,
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: G.ivory,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A7440' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                {['1', '2', '3', '4', '5', '6+'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '10px' }}>
                Bathrooms
              </label>
              <select
                value={bathrooms}
                onChange={e => setBathrooms(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'rgba(255,252,248,0.85)',
                  border: `1.5px solid ${G.goldBorder}`,
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: G.ivory,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239A7440' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
              >
                {['1', '2', '3', '4', '5+'].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
          </motion.div>

          {/* Row 2: House Style */}
          <motion.div variants={fadeUp} style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '12px' }}>
              House Style
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {HOUSE_STYLES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    border: style === s ? `1.5px solid ${G.wine}` : `1.5px solid ${G.goldBorder}`,
                    background: style === s ? G.glassWine : 'rgba(255,252,248,0.60)',
                    color: style === s ? G.wine : G.muted,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Row 3: Floor Selection */}
          <motion.div variants={fadeUp} style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '12px' }}>
              Floor
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {FLOORS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFloor(f)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    border: floor === f ? `1.5px solid ${G.wine}` : `1.5px solid ${G.goldBorder}`,
                    background: floor === f ? G.glassWine : 'rgba(255,252,248,0.60)',
                    color: floor === f ? G.wine : G.muted,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Row 4: Vastu Options */}
          <motion.div variants={fadeUp} style={{ marginBottom: '36px' }}>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: G.wine, marginBottom: '12px' }}>
              Vastu Compliance
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {([
                { key: 'strict',   label: 'Strict Vastu',    desc: 'Full Vastu layout' },
                { key: 'flexible', label: 'Vastu Influenced', desc: 'Loosely Vastu-friendly' },
                { key: 'off',      label: 'No Vastu',         desc: 'Modern layout' },
              ] as const).map(v => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVastuMode(v.key)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    border: vastuMode === v.key ? `1.5px solid ${G.wine}` : `1.5px solid ${G.goldBorder}`,
                    background: vastuMode === v.key ? G.glassWine : 'rgba(255,252,248,0.60)',
                    color: vastuMode === v.key ? G.wine : G.muted,
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Generate button */}
          <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 48px',
                background: isLoading ? G.goldDim : `linear-gradient(135deg, ${G.wine} 0%, ${G.gold} 100%)`,
                border: `1px solid ${G.wineBorder}`,
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: isLoading ? G.muted : '#FAF8F5',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isLoading ? 'none' : '0 4px 24px rgba(191,154,72,0.30)',
              }}
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating Plan…</>
              ) : (
                <><Sparkles size={16} /> Generate Floor Plan</>
              )}
            </motion.button>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(200,50,50,0.06)',
                border: '1px solid rgba(200,50,50,0.18)',
              }}
            >
              <AlertCircle size={15} style={{ color: '#c43c3c', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#c43c3c' }}>{error}</span>
            </motion.div>
          )}
        </motion.form>

        {/* ── Results area ── */}
        <div ref={resultsRef}>
          {isLoading && !imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                padding: '80px 24px',
                background: G.glass,
                border: `1px solid ${G.glassBorder}`,
                borderRadius: '20px',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Loader2 size={48} style={{ color: G.wine, animation: 'spin 1s linear infinite' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: G.ivory, marginBottom: '8px' }}>
                  Composing your floor plan…
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: G.muted, letterSpacing: '0.06em' }}>
                  This usually takes 15–30 seconds
                </p>
              </div>
            </motion.div>
          )}

          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 600, color: G.ivory }}>
                    {floor} · {style}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: G.muted, marginLeft: '12px', letterSpacing: '0.08em' }}>
                    Plot: {dimensions} ft
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={(e) => handleGenerate(e as unknown as FormEvent)}
                    disabled={isLoading}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '7px',
                      padding: '9px 18px',
                      background: G.glass, border: `1px solid ${G.goldBorder}`, borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: G.muted, cursor: 'pointer',
                    }}
                  >
                    <RefreshCw size={12} /> Regenerate
                  </button>
                  {!isLoading && (
                    <button
                      onClick={handleDownload}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        padding: '9px 18px',
                        background: `linear-gradient(135deg, ${G.wine}, ${G.gold})`,
                        border: 'none', borderRadius: '8px',
                        fontFamily: 'Inter, sans-serif', fontSize: '11px', letterSpacing: '0.14em',
                        textTransform: 'uppercase', color: '#FAF8F5', cursor: 'pointer',
                        boxShadow: '0 2px 12px rgba(191,154,72,0.25)',
                      }}
                    >
                      <Download size={12} /> Download
                    </button>
                  )}
                </div>
              </div>

              {/* Presentation board */}
              <div
                ref={boardRef}
                style={{
                  background: '#f5f0e8',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 60px rgba(26,18,8,0.14)',
                  border: `1px solid rgba(200,168,130,0.40)`,
                  fontFamily: 'Georgia, serif',
                  color: '#2a1a0a',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>

                  {/* Left: floor plan image */}
                  <div style={{ flex: 1, minWidth: '280px', background: '#f0ebe0', borderRight: '1px solid #c8a882' }}>
                    {/* Dimension bar top */}
                    <div style={{ padding: '12px 28px 4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontFamily: 'monospace', color: '#5a3e28', borderBottom: '1px solid #5a3e28', paddingBottom: '2px' }}>
                        <span style={{ borderLeft: '1px solid #5a3e28', paddingLeft: '4px' }}>{dimensions.split(/[xX×]/)[0] || '40'}'-0"</span>
                        <span>◄────────────────────►</span>
                        <span style={{ borderRight: '1px solid #5a3e28', paddingRight: '4px' }}>{dimensions.split(/[xX×]/)[0] || '40'}'-0"</span>
                      </div>
                    </div>

                    {/* Image + overlays */}
                    <div style={{ padding: '4px 16px 12px', position: 'relative' }}>
                      {/* Left dimension */}
                      <div style={{ position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '1px', height: '60px', background: '#5a3e28' }} />
                        <span style={{ fontSize: '8px', fontFamily: 'monospace', color: '#5a3e28', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>{dimensions.split(/[xX×]/)[1] || '50'}'-0"</span>
                        <div style={{ width: '1px', height: '60px', background: '#5a3e28' }} />
                      </div>

                      {/* Image wrapper with room number overlays */}
                      <div style={{ position: 'relative' }}>
                        {/* Loading overlay */}
                        {isLoading && (
                          <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: '#e8e0d0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRadius: '8px' }}>
                            <Loader2 size={32} style={{ color: '#5a3e28', animation: 'spin 1s linear infinite' }} />
                            <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#5a3e28', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Rendering vectors…</p>
                          </div>
                        )}

                        <img
                          key={imageUrl}
                          src={imageUrl}
                          alt="AI generated floor plan"
                          style={{ width: '100%', objectFit: 'contain', opacity: isLoading ? 0 : 1, transition: 'opacity 0.7s ease', display: 'block' }}
                          onLoad={() => stopLoading()}
                          onError={() => {
                            setError('Image generation failed. Please try again.');
                            stopLoading();
                            setImageUrl(null);
                          }}
                        />

                        {/* Room number badges */}
                        {!isLoading && positions.map((pos, idx) => (
                          <div
                            key={idx}
                            style={{
                              position: 'absolute',
                              left: `${pos.left}%`,
                              top: `${pos.top}%`,
                              transform: 'translate(-50%, -50%)',
                              zIndex: 20,
                            }}
                          >
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: 'rgba(42,26,10,0.84)',
                              border: '1.5px solid rgba(255,255,255,0.75)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: 8, fontWeight: 700,
                              fontFamily: 'Georgia, serif', boxShadow: '0 1px 4px rgba(0,0,0,0.45)',
                            }}>
                              {idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Floor label */}
                      <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: '#5a3e28', textTransform: 'uppercase', borderTop: '1px solid #5a3e28', paddingTop: '4px' }}>
                        {floor === 'Ground Floor' ? 'Main Gate ↑' : floor === 'Second Floor' ? '▲ Upper Level' : '▲ Terrace Level'}
                      </div>
                    </div>
                  </div>

                  {/* Right: presentation panel */}
                  <div style={{ width: '280px', flexShrink: 0, background: '#faf7f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid #c8a882' }}>

                    {/* Title */}
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #5a3e28', paddingBottom: '12px' }}>
                      <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.16em', textDecoration: 'underline', textTransform: 'uppercase', color: '#2a1a0a', margin: 0, marginBottom: '4px' }}>
                        {floor} Plan
                      </h2>
                      <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', color: '#5a3e28', textTransform: 'uppercase', margin: 0 }}>
                        {style}
                      </p>
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#5a3e28', marginTop: '4px', margin: '4px 0 0' }}>
                        Plot Size — {dimensions || '—'} Feet
                      </p>
                    </div>

                    {/* Legend */}
                    <div>
                      <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textDecoration: 'underline', textTransform: 'uppercase', color: '#2a1a0a', marginBottom: '8px', margin: '0 0 8px' }}>Legend</h3>
                      <table style={{ width: '100%', fontSize: '9px', borderCollapse: 'collapse' }}>
                        <tbody>
                          {legend.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #e0d4c0' }}>
                              <td style={{ padding: '2px 4px 2px 0', color: '#5a3e28', fontWeight: 700, width: '16px', fontFamily: 'Georgia, serif' }}>{item.id}</td>
                              <td style={{ padding: '2px 4px', fontWeight: 600, color: '#2a1a0a', lineHeight: 1.3 }}>{item.name}</td>
                              <td style={{ padding: '2px 0', textAlign: 'right', color: '#5a3e28', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '8px' }}>{item.dim}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Area Statement */}
                    <div style={{ borderTop: '1px solid #c8a882', paddingTop: '12px' }}>
                      <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textDecoration: 'underline', textTransform: 'uppercase', color: '#2a1a0a', marginBottom: '8px', margin: '0 0 8px' }}>Area Statement</h3>
                      <div style={{ fontSize: '9px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600 }}>Built-Up Area</span>
                          <span style={{ color: '#5a3e28', fontFamily: 'monospace' }}>: {areaStats.builtUp}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: 600 }}>Carpet Area</span>
                          <span style={{ color: '#5a3e28', fontFamily: 'monospace' }}>: {areaStats.carpet}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vastu Highlights */}
                    {vastuMode !== 'off' && (
                      <div style={{ borderTop: '1px solid #c8a882', paddingTop: '12px' }}>
                        <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textDecoration: 'underline', textTransform: 'uppercase', color: '#2a1a0a', margin: '0 0 8px' }}>Vastu Highlights</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {VASTU.map((v, i) => (
                            <li key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', fontSize: '8px' }}>
                              <span style={{ color: '#8b6914', flexShrink: 0, marginTop: '1px' }}>◎</span>
                              <span>
                                <span style={{ fontWeight: 700, color: '#2a1a0a', display: 'block' }}>{v.dir}</span>
                                <span style={{ color: '#6a5035', fontStyle: 'italic' }}>{v.note}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Compass */}
                    <div style={{ borderTop: '1px solid #c8a882', paddingTop: '12px', display: 'flex', justifyContent: 'center' }}>
                      <CompassRose />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
