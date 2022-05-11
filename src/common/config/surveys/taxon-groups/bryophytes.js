export default {
  name: 'bryophytes',
  taxonGroups: [126, 42],
  render: [
    'smp:habitat',
    'occ:microscopicallyChecked',
    'occ:fruit',
    'occ:male',
    'occ:female',
    'occ:bulbils',
    'occ:gemmae',
    'occ:tubers',
  ],

  attrs: {
    habitat: {
      type: 'radio',
      id: 187,
      label: 'Habitat',
      icon: 'land',
      default: 'Not selected',
      values: {
        'Arable land, gardens or parks': 18519,
        'Bogs and fens': 18520,
        Coast: 18521,
        Grassland: 18522,
        'Heathland, scrub, hedges': 18523,
        'Industrial and urban': 18524,
        'Inland water': 18525,
        'Mixed habitats': 18526,
        'Unvegetated or sparsely vegetated habitats': 18527,
        Woodland: 18528,
      },
    },
  },
  occ: {
    attrs: {
      number: null, // override incrementShortcut

      microscopicallyChecked: {
        type: 'toggle',
        id: 112,
        icon: 'magnify',
        label: 'Microscopically Checked',
        default: false,
      },
      fruit: {
        type: 'toggle',
        id: 113,
        label: 'Fruit',
        icon: 'fruit',
        default: false,
      },
      male: {
        type: 'toggle',
        id: 114,
        label: 'Male',
        icon: 'gender',
        default: false,
      },
      female: {
        type: 'toggle',
        id: 115,
        label: 'Female',
        icon: 'gender',
        default: false,
      },
      bulbils: {
        type: 'toggle',
        id: 116,
        label: 'Bulbils',
        default: false,
      },
      gemmae: {
        type: 'toggle',
        id: 117,
        label: 'Gemmae',
        default: false,
      },
      tubers: {
        type: 'toggle',
        id: 118,
        label: 'Tubers',
        default: false,
      },
    },
    verify(attrs) {
      if (!attrs.taxon) {
        return { taxon: "can't be blank" };
      }
      return null;
    },
  },
};
