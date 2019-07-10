import http from './http'
import methods from './methods'
import filters from './filters'

const mixins = {
  data() {
    return {
      http,
    }
  },
  methods: {
    $err: http.$err,
    ...methods,
  },
  filters: {
    ...filters,
  },
};

export default mixins