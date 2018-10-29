import React from "react";
import filter from "lodash/filter";

import App from "../components/App";

import init from "../actions/init";
import { registerUser } from "../actions/user";
import {
  installFont,
  uninstallFont,
  addInstalledFontToLocalCache,
  removeUninstalledFontFromLocalCache
} from "../actions/fonts/index";

import Alert from "../libs/alert";

class AppContainer extends React.Component {
  state = {
    isUserRegistered: false,
    announcement: null,
    fonts: [],
    installedFonts: [],
    user: null,
    error: null,
    flags: {},
    loading: true,
    registering: null
  };

  componentDidMount() {
    init(
      (
        error,
        {
          announcements,
          fonts,
          installedFonts,
          flags,
          user,
          lastUpdated,
          isUserRegistered
        }
      ) => {
        this.setState(() => ({
          announcement: announcements && announcements[0],
          fonts,
          installedFonts,
          flags,
          user,
          lastUpdated,
          isUserRegistered,
          error,
          loading: false
        }));
      }
    );
  }

  setFlag = ({ id }, status) => {
    const { flags } = this.state;
    flags[id] = status;
    this.setState(flags);
  };

  registerUser = userObj => {
    this.setState({ registering: true });
    registerUser(userObj, (error, { isUserRegistered, user }) => {
      this.setState(() => ({
        // eslint-disable-next-line
        user: { ...this.state.user, ...user },
        isUserRegistered,
        error,
        registering: false
      }));
    });
  };

  install = font => {
    this.setFlag(font, true);
    installFont(font, error => {
      if (error) {
        // this.setState({ error });
        this.setFlag(font, false);
        return;
      }

      // Update localCache
      addInstalledFontToLocalCache(font, lCError => {
        if (lCError) {
          this.setState({ error: lCError });
          this.setFlag(font, false);
          Alert.error(`${font.familyName} installing failed!.`);
          return;
        }

        this.setState({
          // eslint-disable-next-line
          installedFonts: [...this.state.installedFonts, font]
        });
        this.setFlag(font, false);
        Alert.success(`${font.familyName} installed successfully!.`);
      });
    });
  };

  uninstall = font => {
    this.setFlag(font, true);
    uninstallFont(font, error => {
      if (error) {
        // this.setState({ error });
        this.setFlag(font, false);
        return;
      }

      // Update localCache
      removeUninstalledFontFromLocalCache(font, lCError => {
        if (lCError) {
          this.setState({ error: lCError });
          this.setFlag(font, false);
          Alert.error(`${font.familyName} uninstalling failed!.`);
          return;
        }

        this.setState({
          installedFonts: filter(
            // eslint-disable-next-line
            this.state.installedFonts,
            f => f.id !== font.id
          )
        });
        this.setFlag(font, false);
        Alert.success(`${font.familyName} uninstalled successfully!.`);
      });
    });
  };

  render() {
    return (
      <App
        {...this.state}
        registerUser={this.registerUser}
        installFont={this.install}
        uninstallFont={this.uninstall}
      />
    );
  }
}

export default AppContainer;
