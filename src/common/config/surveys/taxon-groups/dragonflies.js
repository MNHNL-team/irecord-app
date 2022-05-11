const numRanges = {
  1: 18420,
  '2-5': 18421,
  '6-20': 18422,
  '21-100': 18423,
  '101-500': 18424,
  '500+': 18425,
  Present: 18534,
};

export default {
  name: 'dragonflies',
  taxonGroups: [56],

  render: [
    'smp:site',
    'occ:adCount',
    'occ:coCount',
    'occ:ovCount',
    'occ:scCount',
    'occ:laCount',
    'occ:exCount',
    'occ:emCount',
    // 'smp:siteOther',
  ],

  attrs: {
    site: {
      type: 'radio',
      id: 188,
      label: 'Site type',
      icon: 'land',
      default: 'Not selected',
      values: {
        Lake: 18535,
        Reservoir: 18536,
        'Mill lodge': 18537,
        'Large pond': 18538,
        'Small pond': 18539,
        'Garden pond': 18540,
        River: 18541,
        Stream: 18542,
        Ditch: 18543,
        Canal: 18544,
        'Other (please specify in comments)': 18545,
      },
    },
    siteOther: {
      type: 'text',
      id: 189,
      label: 'Other Site Type',
    },
  },
  occ: {
    attrs: {
      number: null, // override incrementShortcut

      adCount: {
        type: 'radio',
        id: 120,
        label: 'Adults',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
      },
      coCount: {
        type: 'radio',
        id: 121,
        label: 'Cop. pairs',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
      },
      ovCount: {
        type: 'radio',
        id: 122,
        label: 'Ovip. females',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
      },
      scCount: {
        type: 'radio',
        id: 123,
        label: 'Ovip. scars',
        icon: 'number',
        info: 'This attribute should be recorded for Willow Emerald only.',
        default: '',
        values: numRanges,
      },
      laCount: {
        type: 'radio',
        id: 124,
        label: 'Larvae',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
      },
      exCount: {
        type: 'radio',
        id: 125,
        label: 'Exuviae',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
      },
      emCount: {
        type: 'radio',
        id: 126,
        label: 'Emergents',
        icon: 'number',
        info: 'How many individuals of this type?',
        default: '',
        values: numRanges,
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
