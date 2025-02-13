import { defineStore } from "pinia";

export const useAddressStore = defineStore("addressStore", {
  state: () => ({
    addressStr: ""
  }),
  actions: {
    setAddress(address: string) {
      this.addressStr = address;
    }
  },
  getters: {
    getAddress(state) {
      return state.addressStr;
    }
  }
});
