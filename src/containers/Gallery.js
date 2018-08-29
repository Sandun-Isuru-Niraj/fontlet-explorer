import React, { Component } from 'react';
import styled from 'styled-components';
import { Switch, Card, Elevation } from '@blueprintjs/core';

import fonts from '../data/fonts';
import installFont from '../lib/installFont';

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
  margin-top: 15px;
`;

const VersionDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 15px;
`;

const VersionContent = styled.div`
  display: flex;
  flex: 1;
`;

const FontName = styled.p`
  font-size: 17px;
  font-family: sans-serif;
  color: #867f7f;

  @media (max-width: 1000px) {
    font-size: 14px;
  }
`;

const Text = styled.p`
  font-size: 11px;
  font-family: sans-serif;

  @media (max-width: 1000px) {
    font-size: 10px;
  }
`;

const Version = styled.p`
  font-size: 11px;
  font-family: sans-serif;
  color: #5a5555;

  @media (max-width: 1000px) {
    font-size: 10px;
  }
`;

const SettingsContent = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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
      loading: '',
      fontData: [],
      loadingFontId: ''
    };

    this.addRemoveFont = this.addRemoveFont.bind(this);
  }

  componentDidMount() {
    this.setState({ fontData: fonts });
  }

  addRemoveFont = async (url, installed, id) => {
    const { fontData } = this.state;
    if (!installed) {
      try {
        this.setState({ loading: true, loadingFontId: id });
        await installFont(url);
        this.setState({ loading: false, loadingFontId: '' });
      } catch (error) {
        // TODO: Show error
      }
    } else {
      // TODO: Set uninstall also like above
    }

    const newFontData = fontData.map(font => {
      if (font.id === id) {
        return {
          ...font,
          installed: !font.installed
        };
      }

      return font;
    });

    this.setState({ fontData: newFontData });
  };

  FontItem = ({ id, name, version, url, installed, fontImage }) => {
    const { loading, loadingFontId } = this.state;
    return (
      <CardContent key={id}>
        {loading &&
          loadingFontId === id && (
            <div className="bp3-progress-bar bp3-intent-primary">
              <div className="bp3-progress-meter" />
            </div>
          )}
        <Content elevation={Elevation.TWO}>
          <FontImage src={fontImage} />

          <SettingsContent>
            <VersionContent>
              <VersionDetails>
                <FontName>{name}</FontName>
                <Version>v{version}</Version>
              </VersionDetails>
            </VersionContent>

            <ToggleButtonWrapper>
              <Switch
                className="switch-style"
                checked={installed}
                large
                onChange={() => {
                  this.addRemoveFont(url, installed, id);
                }}
              />
              <Text>2 fonts installed</Text>
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
