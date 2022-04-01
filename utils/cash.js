function formatPrice(x = "") {
  x = x + "";
  if (x === "0") {
    return " ";
  } else {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

module.exports = {
  formatPrice(x = "") {
    x = x + "";
    if (x === "0") {
      return " ";
    } else {
      return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
};
