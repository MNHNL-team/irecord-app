/** ****************************************************************************
 * Plant survey configuration file.
 **************************************************************************** */
import DateHelp from 'helpers/date';
import LocHelp from 'helpers/location';
import userModel from 'user_model';
import appModel from 'app_model';

function verify(attrs, subSample) {
  const attributes = {};

  // location
  const location = attrs.location || {};
  if (!location.latitude) {
    attributes.location = 'missing';
  }
  if (!subSample && !location.name) {
    attributes.name = 'missing';
  }

  // date
  if (!attrs.date) {
    attributes.date = 'missing';
  } else {
    const date = new Date(attrs.date);
    if (date === 'Invalid Date' || date > new Date()) {
      attributes.date = new Date(date) > new Date() ? 'future date' : 'invalid';
    }
  }

  // location type
  if (!attrs.location_type) {
    attributes.location_type = "can't be blank";
  }

  return attributes;
}

function isSurveyLocationSet(surveySample) {
  const { location } = surveySample.attrs;
  const accurateEnough = LocHelp.checkGridType(
    location,
    surveySample.metadata.gridSquareUnit
  );
  return accurateEnough && location.name;
}

const sharedSmpAttrs = {
  date: {
    values(date) {
      return DateHelp.print(date);
    },
    isValid: val => val && val.toString() !== 'Invalid Date',
    type: 'date',
    set: (value, sample) => {
      sample.attrs.date = value;

      const setDate = smp => {
        smp.attrs.date = value;
      };
      sample.samples.forEach(setDate);
    },
    max: () => new Date(),
  },

  location: {
    id: 'entered_sref',
    required: true,
    label: 'Square',
    values(location, submission) {
      const attributes = {};
      attributes.location_name = location.name; // this is a native indicia attr

      // add other location related attributes
      submission.fields = { ...submission.fields, ...attributes };
      return location.gridref;
    },
  },
  location_accuracy: { id: 176 },
  location_altitude: { id: 38 },
  location_altitude_accuracy: { id: 177 },
  location_source: { id: 178 },
};

const survey = {
  name: 'plant',
  label: 'Plant',
  id: 49,
  complex: true,
  webForm: 'enter-vascular-plants',

  taxonGroups: [84, 44, 128, 76, 115, 41, 75, 126, 42],

  render: [
    'smp:location',
    'smp:date',
    'smp:recorders',
    'smp:comment',
  ],

  attrs: {
    ...sharedSmpAttrs,

    device: {
      id: 179,
      values: {
        iOS: 18418,
        Android: 18419,
      },
    },

    device_version: { id: 180 },
    app_version: { id: 181 },

    recorders: {
      id: 182,
      type: 'inputList',
      placeholder: 'Recorder name',
      icon: 'people',
      info:
        'If anyone helped with documenting the record please enter their name here.',
      values(val, submission) {
        const attributes = {};
        const recorderCount = survey.attrs.recorder_count;

        // add recorder count
        switch (true) {
          case val.length === 1:
            attributes[recorderCount.id] = recorderCount.values['1'];
            break;
          case val.length === 2:
            attributes[recorderCount.id] = recorderCount.values['2'];
            break;
          case val.length <= 5:
            attributes[recorderCount.id] = recorderCount.values['3-5'];
            break;
          case val.length <= 10:
            attributes[recorderCount.id] = recorderCount.values['6-10'];
            break;
          case val.length <= 20:
            attributes[recorderCount.id] = recorderCount.values['11-20'];
            break;
          case val.length >= 21:
            attributes[recorderCount] = recorderCount.values['21+'];
            break;
          default:
            throw new Error('No such recorderCount case found!');
        }
        submission.fields = { ...submission.fields, ...attributes };

        return val;
      },
    },
    recorder_count: {
      id: 185,
      values: {
        1: 18459,
        2: 18460,
        '3-5': 18461,
        '6-10': 18462,
        '11-20': 18463,
        '21+': 18464,
      },
    },
    'time-surveying': {
      id: 186,
      values: {
        '29 mins or less': 18465,
        '30 to 59 mins': 18466,
        '1h - 1h29mins': 18467,
        '1h30mins - 1h59mins': 18468,
        '2h - 2h29mins': 18469,
        '2h30mins -2h59mins': 18470,
        '3h - 3h29mins': 18471,
        '3h30mins - 3h59mins': 18472,
        '4h - 4h29mins': 18473,
        '4h30mins - 4h59mins': 18474,
        '5h - 5h29mins': 18475,
        '5h30mins - 5h59mins': 18476,
        '6h - 6h29mins': 18477,
        '6h30mins - 6h59mins': 18478,
        '7h - 7h29mins': 18479,
        '7h30mins - 7h59mins': 18480,
        '8h - 8h29mins': 18481,
        '8h30mins - 8h59mins': 18482,
        '9h - 9h29mins': 18483,
        '9h30mins - 9h59mins': 18484,
        '10hrs or longer': 18485,
      },
    },

    comment: {
      info:
        "Please include any additional notes about the grid square's environment or your survey methodology. Do not include details about indivual occurences here.",
      icon: 'comment',
      type: 'text',
    },
  },

  smp: {
    render: [
      'occ:taxon',
      'smp:location',
      'occ:status',
      'occ:stage',
      'occ:abundance',
      'occ:identifiers',
      'occ:comment',
      'occ:sensitivity_precision',
    ],

    attrs: {
      ...sharedSmpAttrs,

      location: {
        id: 'entered_sref',
        label: 'Location',
        hideName: true,
        required: true,
        values(location, submission) {
          const attributes = {};
          attributes.location_name = location.name; // this is a native indicia attr

          // add other location related attributes
          submission.fields = { ...submission.fields, ...attributes };
          return location.gridref;
        },
      },
    },
    occ: {
      attrs: {
        taxon: {
          id: 'taxa_taxon_list_id',
          type: 'taxon',
          values(taxon) {
            return taxon.warehouse_id;
          },
        },
        abundance: {
          id: 108,
          icon: 'number',
          info: 'Abundance (DAFOR, LA, LF or count).',
          type: 'input',
          values: value =>
            typeof value === 'string' ? value.toUpperCase() : value, // fixes lowercase values
          validate(value) {
            const re = /^(\d+|[DAFOR]|LA|LF)$/;
            return re.test(value);
          },
        },
        status: {
          id: 109,
          info: 'Please pick the status.',
          default: 'Not Recorded',
          type: 'radio',
          values: {
            Native: 18486,
            Unknown: 18487,
            Introduced: 18488,
            'Introduced - planted': 18489,
            'Introduced - surviving': 18490,
            'Introduced - casual': 18491,
            'Introduced - established': 18492,
            'Introduced - invasive': 18493,
          },
        },
        stage: {
          id: 110,
          info: 'Please pick the life stage.',
          icon: 'stage',
          default: 'Not Recorded',
          type: 'radio',
          values: {
            Flowering: 18494,
            Fruiting: 18495,
            Juvenile: 18496,
            Mature: 18497,
            Seedling: 18498,
            Vegetative: 18499,
          },
        },
        identifiers: {
          id: 37,
          icon: 'user-plus',
          placeholder: 'Name',
          type: 'inputList',
          values(val) {
            if (typeof val === 'string') {
              // backwards compatibility
              return val;
            }

            return val.join(', ');
          },
        },
        comment: {
          info: 'Please add any extra info about this record.',
          type: 'text',
          icon: 'comment',
        },
        sensitivity_precision: {
          metadata: true,
          type: 'toggle',
          icon: 'eyeOff',
          label: 'Sensitive',
        },
      },
      verify(attrs) {
        if (!attrs.taxon) {
          return { taxon: "can't be blank" };
        }
        return null;
      },
    },

    verify: attrs => verify(attrs, true),

    async create(Sample, Occurrence, taxon, surveySample) {
      const { gridSquareUnit, geolocateSurveyEntries } = appModel.attrs;

      const sample = new Sample({
        attrs: {
          location_type: 'british',
          date: surveySample.attrs.date,
        },
        metadata: {
          complex_survey: survey.name,
          gridSquareUnit,
        },
      });

      if (geolocateSurveyEntries) {
        sample.startGPS();
      }

      const occurrence = new Occurrence({ attrs: { taxon } });
      sample.occurrences.push(occurrence);

      const locks = appModel.attrs.attrLocks.complex.plant || {};
      appModel.appendAttrLocks(sample, locks);

      // set sample location to survey's location which
      // can be corrected by GPS or user later on
      // TODO: listen for surveySample attribute changes
      if (isSurveyLocationSet(surveySample)) {
        const surveyLocation = JSON.parse(
          JSON.stringify(surveySample.attrs.location)
        );
        delete surveyLocation.name;

        sample.attrs.location = surveyLocation;

        sample.startGPS();
      }

      surveySample.samples.push(sample);
      await surveySample.save();

      return sample;
    },
  },
  verify,

  create(Sample) {
    const { gridSquareUnit } = appModel.attrs;

    // add currently logged in user as one of the recorders
    const recorders = [];
    if (userModel.hasLogIn()) {
      recorders.push(
        `${userModel.attrs.firstname} ${userModel.attrs.secondname}`
      );
    }

    const sample = new Sample({
      attrs: {
        sample_method_id: 18500,
        recorders,
      },
      metadata: {
        complex_survey: survey.name,
        gridSquareUnit,
      },
    });

    return Promise.resolve(sample);
  },
};

export default survey;
