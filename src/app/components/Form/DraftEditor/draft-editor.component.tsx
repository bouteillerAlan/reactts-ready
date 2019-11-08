import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-alignment-plugin/lib/plugin.css';
import 'draft-js-linkify-plugin/lib/plugin.css';
import './draft-editor.component.scss';

import React, { Component, createRef, RefObject } from 'react';
import DraftJs, { EditorState, EntityInstance, Modifier, DraftHandleValue, RichUtils, ContentState, ContentBlock } from 'draft-js';
import { stateToHTML, Options } from 'draft-js-export-html';
import { convertFromHTML } from 'draft-convert';

import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createStyles from 'draft-js-custom-styles';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createDragNDropUploadPlugin from '@mikeljames/draft-js-drag-n-drop-upload-plugin'
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createResizeablePlugin from 'draft-js-resizeable-plugin';

import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
} from 'draft-js-buttons';

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'font-family', 'float'], 'CUSTOM_');
const staticToolbarPlugin = createToolbarPlugin();
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const linkifyPlugin = () => ({ //src: https://www.draftail.org/docs/extensions-tutorial-linkify
  handlePastedText(
    text: string,
    html: string,
    editorState: EditorState,
    { setEditorState }: { setEditorState: (editorState: EditorState) => void },
  ) {
    let nextState = editorState
    if (text.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
      const selection = nextState.getSelection()

      if (selection.isCollapsed()) {
        const nextContentState = nextState.getCurrentContent().createEntity(
          "LINK",
          "MUTABLE",
          { url: text },
        )

        nextState = EditorState.createWithContent(nextContentState)

      } else {
        const content = nextState.getCurrentContent()
        const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
          url: text,
        })
        const entityKey = contentWithEntity.getLastCreatedEntityKey()
        nextState = RichUtils.toggleLink(nextState, selection, entityKey)
      }
      setEditorState(nextState)
      return "handled"
    }

    return "not-handled"
  },
})

const decorator = composeDecorators(
  blockDndPlugin.decorator,
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
);
const imagePlugin = createImagePlugin({ decorator });
const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
  handleUpload: (param: any) => {console.log('[DraftEditor] - dnd upload param ', param)},
  addImage: imagePlugin.addImage,
});

const plugins = [
  staticToolbarPlugin,
  imagePlugin,
  staticToolbarPlugin,
  blockDndPlugin,
  dragNDropFileUploadPlugin,
  focusPlugin,
  alignmentPlugin,
  resizeablePlugin,
  linkifyPlugin
];
const { Toolbar } = staticToolbarPlugin;
const { AlignmentTool } = alignmentPlugin;




interface HeadlinesPickerProps {
  onOverrideContent: (param: any) => void
  setEditorState: (editorState: EditorState) => void
  getEditorState: () => EditorState
}

interface HeadlinesPickerState {

}

class HeadlinesPicker extends Component<HeadlinesPickerProps, HeadlinesPickerState> {
  componentDidMount() {
    setTimeout(() => { window.addEventListener('click', this.onWindowClick); });
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick = () =>
    // Call `onOverrideContent` again with `undefined`
    // so the toolbar can show its regular content again.
    this.props.onOverrideContent(undefined);

  render() {
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    return (
      <div>
        {buttons.map((Button, i) =>
          <Button key={i} {...this.props} />
        )}
      </div>
    );
  }
}

interface HeadlinesButtonProps {
  onOverrideContent: (param: any) => void
}

interface HeadlinesButtonState {

}

class HeadlinesButton extends Component<HeadlinesButtonProps, HeadlinesButtonState> {
  onClick = () =>
    // A button can call `onOverrideContent` to replace the content
    // of the toolbar. This can be useful for displaying sub
    // menus or requesting additional information from the user.
    this.props.onOverrideContent(HeadlinesPicker);

  render() {
    return (
      <div className='headlineButtonWrapper'>
        <button onClick={this.onClick} className='headlineButton'>
          H
        </button>
      </div>
    );
  }
}



export interface IDraftEditorState {
  editorState: EditorState
}

export interface IDraftEditorProps {
  onChange: (html: string) => void
  html?: string
}

function getPropertyFromCssText(cssText: string, propertyName: string): string {
  console.log('[DraftEditor] - get property from cssText', cssText, typeof cssText)
  try {
    return cssText
    .split(';')
    .map( (el => el.trim()))
    .filter( (propertyKeyValuePair: string) => (
      propertyKeyValuePair.split(':')[0] === propertyName
    ))[0]
    .split(':')[1]
    .replace(';', '')
    .trim()
  } catch(e) {
    return 'not-found'
  }
  
}

function importHtmlConfig(): any {return { // type any because IConvertFromHTMLConfig is not up to date, and do not correspond to the draft convert doc ...

  htmlToStyle: (nodeName: string, node: HTMLElement, currentStyle: any) => { // convert inline styles to draft

    // color
    if (nodeName === 'span' && node.style.color) {
      console.log('[DraftEditor] - import config - htmlToStyle node - ', node)
      currentStyle = currentStyle.add('CUSTOM_COLOR_' + node.style.color)
    }

    // font-size
    if (nodeName === 'span' && node.style.fontSize) {
      currentStyle = currentStyle.add('CUSTOM_FONT_SIZE_' + node.style.fontSize)
    }

    // font-family
    if (nodeName === 'span' && node.style.fontFamily) {
      currentStyle = currentStyle.add('CUSTOM_FONT_FAMILY_' + node.style.fontFamily)
    }

    return currentStyle
  },

  htmlToEntity: (nodeName: string, node: any, createEntity: Function) => {
    if (nodeName === 'img') {
      console.log('[DraftEditor] - ',getPropertyFromCssText(node.style.cssText, 'width'))
      console.log('[DraftEditor] - ', node.getAttribute('data-container-width'))
      const entity = createEntity(
          'IMAGE',
          'IMMUTABLE',
          {
            src: node.src,
            // get width with the stored editor container width value and the image width value. /!\ when image is added into editor, the cssText width property is not set !
            width: (node.style.cssText ? Number(getPropertyFromCssText(node.style.cssText, 'width')!.replace('px', '')) : 200) / node.getAttribute('data-container-width') * 100,
            alignment: (() => {
              const floatProperty = getPropertyFromCssText(node.style.cssText, 'float')
              console.log('[DraftEditor] - float property - ', floatProperty)
              switch (floatProperty) {
                case 'right':
                  console.log('right')
                  return 'right'
                case 'left':
                    console.log('left')

                  return 'left'
                default:
                  const marginLeftProperty = getPropertyFromCssText(node.style.cssText, 'margin-left')
                  console.log('[DraftEditor] - margin left', marginLeftProperty)
                  if(marginLeftProperty === 'auto') return 'center'
                  return 'default'
              }
            })()
          }
      )
      console.log('[DraftEditor] - html to entity - img node / entity', node, entity, createEntity)

      return entity
    }
  },

  htmlToBlock: (nodeName: string) => {
    if (nodeName === "hr" || nodeName === "img") {
      // "atomic" blocks is how Draft.js structures block-level entities.
      return "atomic"
    }

    return null
  },
}}

export default class DraftEditor extends Component<IDraftEditorProps, IDraftEditorState> {

  editorContainer: RefObject<HTMLDivElement>
  editor: RefObject<Editor>

  constructor(props: IDraftEditorProps) {
    super(props)

    const { html } = props

    console.log('[DraftEditor] - html - ', html)
    if(!!html) {
      this.state = {
        editorState: EditorState.createWithContent(convertFromHTML(importHtmlConfig())(html))
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty()
      }
    }

    this.editor = createRef<Editor>()
    this.editorContainer = createRef<HTMLDivElement>()
  }

  componentWillReceiveProps(newProps: IDraftEditorProps) {

    const { html } = this.props
    if (html !== newProps.html && newProps.html && !html) {
     
      this.setState({
        editorState: EditorState.createWithContent(convertFromHTML(importHtmlConfig())(newProps.html))
      })
    } else if (!newProps.html) {
      this.setState({editorState: EditorState.createEmpty()})
    }
  }

  updateEditorState = (editorState: EditorState) => this.setState({ editorState });

  onChange = (editorState: EditorState) => {
    const inlineStyles = exporter(editorState);
    console.log('[DraftEditor] - raw editor map - ', DraftJs.convertToRaw(this.state.editorState.getCurrentContent()))
    
    const exportOptions: Options = {
      inlineStyles,
      entityStyleFn: (entity: EntityInstance) => {
        const entityType = entity.getType().toLowerCase()
        if (entityType === 'image') {
          const data = entity.getData();
          return {
            element: 'img',
            attributes: {
              src: data.src,
              ['data-container-width']: (() => {
                const editorContainer = this.editorContainer.current
                const editorContainerWidth = editorContainer!.offsetWidth
                const editorContainerPadding = Number(window
                  .getComputedStyle(editorContainer!)
                  .getPropertyValue('padding')
                  .replace('px', '')
                )
                return editorContainerWidth + editorContainerPadding
              })()
            },
            style: {
              width: (() => {
                const editorContainer = this.editorContainer.current
                const editorContainerWidth = editorContainer!.offsetWidth
                const editorContainerPadding = Number(window
                  .getComputedStyle(editorContainer!)
                  .getPropertyValue('padding')
                  .replace('px', '')
                )
                return `${data.width * (editorContainerWidth - (editorContainerPadding * 2)) / 100}px`
              })(),
              ...( data.alignment === 'left' && { float: 'left' }),
              ...( data.alignment === 'right' && { float: 'right' }),
              ...( data.alignment === 'center' && { marginLeft: 'auto', marginRight: 'auto', display: 'block' })
            },
          };
        }
      },
    }
    const html = stateToHTML(editorState.getCurrentContent(), exportOptions);
    

    this.props.onChange(html)
    this.setState({
      editorState,
    });
  };

  
  
  focus = () => {
    this.editor.current!.focus();
  };

  toggleFontSize = (fontSize: string) => {
    const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize);

    return this.updateEditorState(newEditorState);
  };

  toggleColor = (color: any) => {
    const newEditorState = styles.color.toggle(this.state.editorState, color);

    return this.updateEditorState(newEditorState);
  };

  toggleFontFamily = (fontFamily: string) => {
    const newEditorState = styles.fontFamily.toggle(this.state.editorState, fontFamily);

    return this.updateEditorState(newEditorState);
  };

  handleBeforeInput = (chars: any, editorState: EditorState, eventTimestamp: number) => {
        const currentContentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        this.updateEditorState(EditorState.push(
            editorState,
            Modifier.replaceText(
                currentContentState,
                selectionState,
                chars
            ),
            'change-block-data'
        ));

        return 'handled' as DraftHandleValue
  };

  render() {

    const options = (x: any) => x.map((fontSize: number) => {
      return <option key={fontSize} value={fontSize}>{fontSize}</option>;
    });
    

    return (
      <>
      <div className='editor' ref={this.editorContainer}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          ref={this.editor}
          customStyleFn={customStyleFn}
          handleBeforeInput={this.handleBeforeInput}
        />
        <Toolbar>
          {
            (externalProps: any) => (
              <div  className='editor-toolbar'>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <select onChange={e => this.toggleFontSize(e.target.value)}>
                  {options(['12px', '18px', '24px', '36px', '48px', '60px', '72px'])}
                </select>
                <select onChange={e => this.toggleColor(e.target.value)}>
                  {options(["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"])}
                </select>
                <select className="editor-large-select" onChange={e => this.toggleFontFamily(e.target.value)}>
                  {options(['Quicksand', 'Roboto', 'Helvetica Neue'])}
                </select>
              </div>
            )
          }
        </Toolbar>
        <AlignmentTool />
      </div>
      {/* <div style={{backgroundColor: 'white'}}> */}
        {/* <h2>Exported To HTML</h2> */}
        {/* <div dangerouslySetInnerHTML={{ __html: html }}/> */}
        {/* <pre style={{backgroundColor: 'lightgrey', maxWidth:'800px'}}>{html}</pre> */}
      {/* </div> */}
    </>
    );
  }
}

function findLinkEntities(contentBlock: ContentBlock, callback: any, contentState: ContentState) {

  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props: any) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

function findImageEntities(contentBlock: ContentBlock, callback: any, contentState: ContentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'IMAGE'
      );
    },
    callback
  );
}

const Image = (props: any) => {
  const {
    height,
    src,
    width,
  } = props.contentState.getEntity(props.entityKey).getData();
}
