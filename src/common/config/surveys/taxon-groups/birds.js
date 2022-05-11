/** ****************************************************************************
 * General survey configuration file.
 **************************************************************************** */
const survey = {
  name: 'birds',
  taxonGroups: [2,39],

  render: [
    {
      id: 'occ:number',
      label: 'Abundance',
      icon: 'number',
      group: ['occ:number', 'occ:number-ranges'],
    },

    'occ:stage',
    'occ:breeding',
    'occ:sex',
    'occ:identifiers',
  ],

  occ: {
    attrs: {
      breeding: {
        id: 111,
        type: 'radio',
        label: 'Breeding',
        info: 'Please pick the breeding details for this record.',
        values: [
          { value: 'not recorded', id: 18501 },

          { isPlaceholder: true, label: 'Non-breeding' },
          { value: '00: Migration, Flying or Summering (M/F/U)', id: 18502 },

          { isPlaceholder: true, label: 'Possible breeding' },
          { value: '01: Nesting habitat (H)', id: 18503 },
          { value: '02: Singing male (S)', id: 18504 },

          { isPlaceholder: true, label: 'Probable breeding' },
          { value: '03: Pair in suitable habitat (P)', id: 18505 },
          { value: '04: Permanent territory (T)', id: 18506 },
          { value: '05: Courtship and display (D)', id: 18507 },
          { value: '06: Visiting probable nest site (N)', id: 18508 },
          { value: '07: Agitated behaviour (A)', id: 18509 },
          { value: '08: Brood patch on incubating adult (I)', id: 18510 },
          { value: '09: Nest building (B)', id: 18511 },

          { isPlaceholder: true, label: 'Confirmed breeding' },
          { value: '10: Distraction display (DD)', id: 18512 },
          { value: '11: Used nest or eggshells (UN)', id: 18513 },
          { value: '12: Recently fledged (FL)', id: 18514 },
          { value: '13: Occupied nest (ON)', id: 18515 },
          { value: '14: Faecal sac or food (FF)', id: 18516 },
          { value: '15: Nest with eggs (NE)', id: 18517 },
          { value: '16: Nest with young (NY)', id: 18518 },
        ],
      },
    },
  },
};

export default survey;
