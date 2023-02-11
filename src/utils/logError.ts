export default function logError(error: Error) {
  console.log(
    `xpan@${
      process.config.variables.host_arch
    } time; ${new Date().toLocaleDateString()}: ${error.name}}`
  );
  console.trace(error);
}
