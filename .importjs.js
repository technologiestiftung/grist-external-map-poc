module.exports = {
  moduleNameFormatter({ pathToImportedModule }) {
    return pathToImportedModule
      .replace("./src/components/", "@components/")
      .replace("./src/common/", "@common/")
      .replace("./src/lib/", "@lib/")
      .replace(/\.ts$/gs, "");
  },
};
