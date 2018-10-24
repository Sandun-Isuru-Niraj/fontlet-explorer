import React, { Component } from "react";
import styled from "styled-components";
import { Switch, Card, Elevation } from "@blueprintjs/core";

import fonts from "../data/fonts";
import installFont from "../lib/installFont";
import uninstallFont from "../lib/uninstallFonts";

import dbFonts from "../lib/db/fonts";

// Styles
const Wrapper = styled.div`
  height: 100vh;
  padding: 15px;
`;

const Content = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const CardContent = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const VersionDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 15px;
`;

const VersionContent = styled.div`
  display: flex;
  flex: 1;
`;

const Version = styled.p`
  font-size: 17px;
  color: #867f7f;
  margin-left: 20px;
  margin-bottom: 0px;
  @media (max-width: 1000px) {
    font-size: 14px;
  }
`;

const Variant = styled.p`
  font-size: 17px;
  color: #867f7f;
  margin-left: 20px;
  margin-bottom: 0px;
  @media (max-width: 1000px) {
    font-size: 14px;
  }
`;

const SettingsContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: #f7f7f7;
  padding: 20px;
`;

const FontImage = styled.img`
  width: 100%;
  height: 100%;
`;

const ToggleButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      fontData: [],
      loadingFontId: ""
    };

    this.addRemoveFont = this.addRemoveFont.bind(this);
  }

  componentDidMount() {
    fonts.forEach(f => {
      dbFonts.find({ id: f.id }, (err, resp) => {
        if (err) {
          // eslint-disable-next-line no-unused-vars
          const Alert = new Notification("Oops!.. Something went wrong!");
          return;
        }

        const font = (resp && resp[0]) || {};
        // TODO: Fix lint issue
        // eslint-disable-next-line
        this.setState({fontData: [...this.state.fontData, { ...f, ...font }]});
      });
    });
  }

  addRemoveFont = async (installing, id) => {
    const { fontData } = this.state;
    const fontsToBeInstalled = fontData.find(f => f.id === id);

    this.setState({ loading: true, loadingFontId: id });

    if (installing) {
      try {
        const fontList = fontsToBeInstalled.list;
        installFont(fontList, error => {
          if (error) {
            // eslint-disable-next-line no-unused-vars
            const Alert = new Notification("Oops!.. Font installing failed!");
            this.setState({ loading: false, loadingFontId: "" });
            return;
          }

          // Update states
          const newFontData = fontData.map(font => {
            if (font.id === id) {
              return {
                ...font,
                installed: true
              };
            }
            return font;
          });

          this.setState({
            loading: false,
            loadingFontId: "",
            fontData: newFontData
          });
          // eslint-disable-next-line no-unused-vars
          const Alert = new Notification("Font installed successfully! ");

          // Update storage
          dbFonts.update({ id }, { type: "fonts", id, installed: true }, dbErr => {
            if (dbErr) {
              // eslint-disable-next-line
              const Alert = new Notification("Oops!.. Something wrong in updating database.");
            }
          });
        });
      } catch (error) {
        // eslint-disable-next-line
        const Alert = new Notification("Oops!.. Font installing failed!");
        this.setState({ loading: false, loadingFontId: "" });
      }
    } else {
      uninstallFont(fontsToBeInstalled, error => {
        if (error) {
          // eslint-disable-next-line no-unused-vars
          const Alert = new Notification("Oops!.. Font uninstalling failed!");
          this.setState({ loading: false, loadingFontId: "" });
          return;
        }

        // Update states
        const newFontData = fontData.map(font => {
          if (font.id === id) {
            return {
              ...font,
              installed: false
            };
          }
          return font;
        });
        this.setState({
          loading: false,
          loadingFontId: "",
          fontData: newFontData
        });

        // Update storage
        dbFonts.update({ id }, { type: "fonts", id, installed: false }, dbErr => {
          if (dbErr) {
            // eslint-disable-next-line no-unused-vars
            const Alert = new Notification("Oops!.. Something wrong in updating database.");
          }
        });
      });
    }
  };

  FontItem = ({ id, version, installed, fontImage, fontVariants }) => {
    const { loading, loadingFontId } = this.state;

    return (
      <CardContent className="card-style" key={id}>
        <Content elevation={Elevation.TWO}>
          <FontImage src={fontImage} />

          {loading &&
            loadingFontId === id && (
              <div className="bp3-progress-bar bp3-intent-primary">
                <div className="bp3-progress-meter" />
              </div>
            )}

          <SettingsContent>
            <VersionContent>
              <VersionDetails>
                <Version>v {version}</Version>
                <Variant>Number of styles : {fontVariants}</Variant>
              </VersionDetails>
            </VersionContent>

            <ToggleButtonWrapper>
              <Switch
                className="switch-style"
                checked={installed || false}
                large
                onChange={() => {
                  this.addRemoveFont(!installed, id);
                }}
              />
            </ToggleButtonWrapper>
          </SettingsContent>
        </Content>
      </CardContent>
    );
  };

  render() {
    const { fontData } = this.state;

    return <Wrapper>{fontData.map(this.FontItem)}</Wrapper>;
  }
}

export default Gallery;
