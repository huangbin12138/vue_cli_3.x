import http from './http'
import tools from './tools'
import methods from './methods'
import filters from './filters'


const mixins = {
  data() {
    return {
      http,
      tools,
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