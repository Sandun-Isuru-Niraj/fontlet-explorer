import uninstall from "../uninstaller/linux";
import install from "../installer/linux";

const linuxUpdater = async (font, cb) => {
  // Uninstall font first
  uninstall(font, uninsErr => {
    if (uninsErr) {
      cb({ message: "Updating failed!", params: uninsErr }, null);
      return;
    }

    // Update new version
    install(font, insErr => {
      if (insErr) {
        cb({ message: "Updating failed!", params: insErr }, null);
        return;
      }

      cb(null, font);
    });
  });
};

export default linuxUpdater;
