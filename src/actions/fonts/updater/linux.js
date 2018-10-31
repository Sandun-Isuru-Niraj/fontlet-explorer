import uninstall from "../uninstaller/linux";
import install from "../installer/linux";

const linuxUpdater = async (font, cb) => {
  // Uninstall font first
  uninstall(font, (uninsErr, uninsResp) => {
    if (uninsErr) {
      cb(null, {
        ...font,
        ...uninsResp,
        updating: false,
        error: {
          message: "Updating failed!",
          params: uninsErr
        }
      });
      return;
    }

    // Update new version
    install(font, (insErr, insResp) => {
      if (insErr || insResp.error) {
        cb(null, {
          ...font,
          ...insResp,
          updating: false,
          error: {
            message: "Updating failed!",
            params: insErr
          }
        });
        return;
      }

      cb(null, {
        ...font,
        ...insResp,
        updating: false,
        isUpdateAvailable: false
      });
    });
  });
};

export default linuxUpdater;
