import vue from 'vue'
import { removeElement } from "./remove-element";
import { CommonHelperModule } from "../../../../src/helpers/common.helper.module";

const { generateUUID } = CommonHelperModule;
const isDocument = () => typeof document !== 'undefined';

let instance = {
  _instances: {},
  setInstance (e, id) {
    const instanceUUID = id || generateUUID();
    this._instances[instanceUUID] = e;
    return {
      instanceUUID,
      instanceDto: e
    }
  }
};
let link = {
  _instances: {},
  setLink (e, id) {
    const instanceUUID = id || generateUUID();
    this._instances[instanceUUID] = e;
    return instanceUUID
  }
};

const destroy = (id) => {
  return () => {
    const el = document.body.querySelector('.toast-context');
    if (el) {
      document.body.removeChild(el)
    }

    if (instance._instances[id]) {
      instance._instances[id].stopTimer();
      removeElement(instance._instances[id].$el);
      // instance.$el.remove();
      instance._instances[id] = null;
      delete instance._instances[id]
    }
    if (link._instances[id]) {
      link._instances[id]._removeLink();
      link._instances[id] = null
    }
  }
};

const mount = (component, { props, element } = {}) => {
  if(!isDocument()) {
    return ;
  }

  let el = element ? element : document.createElement('div');

  el.classList.add('toast-context');

  const ComponentCtor = vue.extend(component);
  const ID = generateUUID();
  const insID = instance.setInstance(new ComponentCtor({
    propsData: {
      ...props,
      onDestroy: destroy(ID)
    },
  }), ID);

  document.body.appendChild(el);
  insID.instanceDto.$mount(el);
  link.setLink({
    instance: insID.instanceDto,
    el,
    destroy,
    _removeLink () {
      delete this.instance;
      delete this.el;
      delete this.destroy;
      link._instances[ID] = null;
      delete link._instances[ID];
      delete this._removeLink;
    }
  });
  return link
};

export default mount
