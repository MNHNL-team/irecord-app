export default {
  name: 'plants-fungi',
  taxonGroups: [
    // Plants excluding moss
    84, 44, 128, 76, 115, 41, 75,
    // Fungi
    21
  ],

  render(model) {
    const group = ['occ:number', 'occ:number-ranges'];
    const getTopParent = m => (m.parent ? getTopParent(m.parent) : m);
    const topParent = getTopParent(model);
    if (topParent.metadata.complex_survey) {
      group.splice(1, 0, 'occ:numberDAFOR');
    }

    return [
      {
        id: 'occ:number',
        label: 'Abundance',
        icon: 'number',
        info: 'How many individuals of this type?',
        group,
      },

      'occ:stage',
      'occ:sex',
      'occ:identifiers',
    ];
  },

  attrs: {},
  occ: {
    attrs: {
      numberDAFOR: {
        type: 'radio',
        id: 2,
        values: {
          Dominant: 1,
          Abundant: 2,
          Frequent: 3,
          Occasional: 4,
          Rare: 5,
        },
      },
      number: {
        id: 5,
        label: 'Abundance',
        icon: 'number',
        type: 'slider',
        incrementShortcut: true,
      },
      'number-ranges': {
        id: 103,
        type: 'radio',
        values: [
          { value: null, isDefault: true, label: 'Present' },
          { value: 1, id: 18420 },
          { value: '2-5', id: 18421 },
          { value: '6-20', id: 18422 },
          { value: '21-100', id: 18423 },
          { value: '101-500', id: 18424 },
          { value: '500+', id: 18425 },
        ],
      },
    },
  },
};
