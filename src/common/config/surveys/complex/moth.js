/** ****************************************************************************
 * Plant survey configuration file.
 **************************************************************************** */
import DateHelp from 'helpers/date';
import userModel from 'user_model';
import appModel from 'app_model';

const sex = {
  Male: 18432,
  Female: 18433,
  Mixed: 18434,
};

const stage = {
  'Not recorded': 18438,
  Adult: 18439,
  Larva: 18440,
  'Larval web': 18441,
  'Larval case': 18442,
  Mine: 18443,
  Egg: 18444,
  'Egg batch': 18445,
  Pupa: 18446,
};

const survey = {
  name: 'moth',
  label: 'Moth',
  id: 50,
  complex: true,

  webForm: 'enter-moth-sightings',

  render: [
    'smp:location',
    'smp:date',
    'smp:recorders',
    'smp:method',
    'smp:comment',
  ],

  attrs: {
    location: {
      id: 'entered_sref',
      icon: 'pin',
      values(location, submission) {
        // convert accuracy for map and gridref sources
        const { accuracy, source, gridref, altitude, name } = location;
        const keys = survey.attrs;

        const locationAttributes = {
          location_name: name, // location_name is a native indicia attr
          [keys.location_source.id]: source,
          [keys.location_altitude.id]: altitude,
          [keys.location_altitude_accuracy.id]: location.altitudeAccuracy,
          [keys.location_accuracy.id]: accuracy,
        };

        // add other location related attributes
        submission.fields = { ...submission.fields, ...locationAttributes };

        if (submission.fields.entered_sref_system === 'OSGB') {
          return gridref; // TODO: backwards comp, remove when v5 Beta testing finished
        }

        const lat = parseFloat(location.latitude);
        const lon = parseFloat(location.longitude);
        if (Number.isNaN(lat) || Number.isNaN(lat)) {
          return null;
        }

        return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
      },
    },
    location_accuracy: { id: 176 },
    location_altitude: { id: 38 },
    location_altitude_accuracy: { id: 177 },
    location_source: { id: 178 },

    device: {
      id: 179,
      values: {
        iOS: 18418,
        Android: 18419,
      },
    },

    device_version: { id: 180 },
    app_version: { id: 181 },

    date: {
      values(date) {
        return DateHelp.print(date);
      },
      type: 'date',
      icon: 'calendar',
      info:
        'If trapping overnight please enter the date for the evening on which the trap was put out.',
      max: () => new Date(),
    },

    recorders: {
      id: 112,
      type: 'inputList',
      required: true,
      placeholder: 'Recorder name',
      info:
        'If anyone helped with documenting the record please enter their name here.',
      icon: 'people',
      values(val) {
        return val.join(', ');
      },
    },

    method: {
      id: 184,
      type: 'radio',
      label: 'Method',
      info:
        'Please enter your sampling method (i.e. type of trap or recording method).',
      default: 'Not Recorded',
      values: {
        'MV light': 18447,
        'LED light': 18448,
        'Actinic light': 18449,
        'Light trapping': 18450,
        'Daytime observation': 18451,
        Dusking: 18452,
        'Attracted to a lighted window': 18453,
        Sugaring: 18454,
        'Wine roping': 18455,
        'Beating tray': 18456,
        'Pheromone trap': 18457,
        'Other method (add comment)': 18458,
      },
    },

    comment: {
      info: 'Please add any extra info about this list.',
      icon: 'comment',
      type: 'text',
    },
  },
  occ: {
    render: [
      'occ:taxon',
      'occ:number',
      'occ:stage',
      'occ:sex',
      'occ:identifiers',
      'occ:comment',
    ],

    attrs: {
      taxon: {
        id: 'taxa_taxon_list_id',
        type: 'taxon',
        values(taxon) {
          return taxon.warehouse_id;
        },
      },
      number: {
        id: 5,
        label: 'Quantity',
        icon: 'number',
        type: 'slider',
        info: 'How many individuals of this type?',
      },
      stage: {
        type: 'radio',
        id: 107,
        label: 'Stage',
        icon: 'stage',
        required: true,
        info:
          'Please indicate the stage of the organism. If you are recording larvae, cases or leaf-mines please add the foodplant in to the comments field, as this is often needed to verify the records.',
        values: stage,
      },
      sex: {
        type: 'radio',
        id: 105,
        label: 'Sex',
        icon: 'gender',
        info: 'Please indicate the sex of the organism.',
        default: 'Not Recorded',
        values: sex,
      },
      identifiers: {
        id: 37,
        placeholder: 'Name',
        icon: 'user-plus',
        type: 'inputList',
        info:
          'If anyone helped with the identification please enter their name here.',
        values(val) {
          return val.join(', ');
        },
      },
      comment: {
        info: 'Please add any extra info about this occurrence.',
        icon: 'comment',
        type: 'text',
      },
    },
    verify(attrs) {
      if (!attrs.taxon) {
        return { taxon: "can't be blank" };
      }

      if (!attrs.stage) {
        return { stage: "can't be blank" };
      }
      return null;
    },

    create(Occurrence, taxon) {
      const newOccurrene = new Occurrence({ attrs: { taxon, number: 1 } });

      const locks = appModel.attrs.attrLocks.complex.moth || {};
      appModel.appendAttrLocks(newOccurrene, locks);
      return newOccurrene;
    },
  },

  verify(attrs) {
    const attributes = {};

    // location
    const location = attrs.location || {};
    if (!location.latitude) {
      attributes.location = 'missing';
    }

    // date
    if (!attrs.date) {
      attributes.date = 'missing';
    } else {
      const date = new Date(attrs.date);
      if (date === 'Invalid Date' || date > new Date()) {
        attributes.date =
          new Date(date) > new Date() ? 'future date' : 'invalid';
      }
    }

    // location type
    if (!attrs.location_type) {
      attributes.location_type = "can't be blank";
    }

    if (!attrs.recorders || !attrs.recorders.length) {
      attributes.recorders = "can't be blank";
    }

    return attributes;
  },

  onSend() {
    return {
      34: userModel.attrs.email,
    };
  },

  create(Sample) {
    // add currently logged in user as one of the recorders
    const recorders = [];
    if (userModel.hasLogIn()) {
      recorders.push(
        `${userModel.attrs.firstname} ${userModel.attrs.secondname}`
      );
    }

    const sample = new Sample({
      attrs: {
        date: '', // user should specify the trap time
        recorders,
      },
      metadata: {
        complex_survey: survey.name,
      },
    });

    sample.startGPS();

    return Promise.resolve(sample);
  },
};

export default survey;
