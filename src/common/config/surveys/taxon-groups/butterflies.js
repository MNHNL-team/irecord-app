const sex = {
  Male: 18432,
  Female: 18433,
  Mixed: 18434,
};

const stage = {
  Adults: 18529,
  Larvae: 18530,
  Eggs: 18531,
  Pupae: 18532,
  'Larval webs': 18533,
};

export default {
  name: 'butterflies',
  taxonGroups: [119],
  render: [
    {
      id: 'occ:number',
      label: 'Abundance',
      icon: 'number',
      group: ['occ:number', 'occ:number-ranges'],
    },
    'occ:stage',
    'occ:sex',
    'occ:identifiers',
  ],

  attrs: {},
  occ: {
    attrs: {
      sex: {
        type: 'radio',
        id: 105,
        label: 'Sex',
        icon: 'gender',
        info: 'Please indicate the sex of the organism.',
        default: 'Not Recorded',
        values: sex,
      },
      stage: {
        type: 'radio',
        id: 119,
        label: 'Stage',
        icon: 'stage',
        info: 'Please pick the life stage.',
        default: 'Not Recorded',
        values: stage,
      },
      number: {
        id: 5,
        info: 'How many individuals of this type?',
        label: 'Abundance',
        icon: 'number',
        type: 'slider',
        incrementShortcut: true,
      },
      'number-ranges': {
        type: 'radio',
        id: 104,
        label: 'Abundance',
        icon: 'number',
        values: [
          { value: null, isDefault: true, label: 'Not Recorded' },
          { value: '1', id: 18426 },
          { value: '2-9', id: 18427 },
          { value: '10-29', id: 18428 },
          { value: '30-99', id: 18429 },
          { value: '100+', id: 18430 },
        ],
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
