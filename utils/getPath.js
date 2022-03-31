const getPath = (path) => {
  return (
    process.env.BASE_URL +
    "/" +
    path[path.length - 2] +
    "/" +
    path[path.length - 1]
  );
};

module.exports = getPath;
