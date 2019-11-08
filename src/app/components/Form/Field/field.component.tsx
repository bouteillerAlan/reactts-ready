import * as React from 'react';
import { IErrors, IFormContext, FormContext, IValues } from '../form.component';
import { Multiselect} from 'react-widgets';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { registerLocale} from  'react-datepicker';
import fr from 'date-fns/locale/fr';
import { msToHMS, hMSToMs } from '../../../../config/utils';
import './field.component.scss';

// import DraftEditor from '../DraftEditor/draft-editor.component';

registerLocale('fr', fr);


const API_URL = process.env.REACT_APP_API_URL;


/* The available editors for the field */
type Editor = "textbox" | "password" | "multilinetextbox" | "dropdown" | "number" | "image" | "checkbox" | "video" | "entitydropdown" | "multientitydropdown" | "wyziwyg" | "date" | "time";

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}

export interface IFieldProps {
  /* The unique field name */
  id: string;

  /* The label text for the field */
  label?: string;

  /* The placeholder text for the field */
  placeholder?: string;

  /* The editor for the field */
  editor?: Editor;

  /* The drop down items for the field */
  options?: string[];

  /* The entity drop down items for the field */
  entityOptions?: IEntityDropdownOption[];

  /* The field value */
  value?: any;

   /* The field validator function and argument */
   validation?: IValidation[];

   /* The custom container style */
   containerStyle?: React.CSSProperties
}

export interface IEntityDropdownOption {
  key: string,
  value: string,
}

export const Field: React.SFC<IFieldProps> = ({
  id,
  label,
  placeholder,
  editor,
  options,
  entityOptions,
  value,
  containerStyle,
  children
}) => {


  /**
   * Gets the validation error for the field
   * @param {IErrors} errors - All the errors from the form
   * @returns {string[]} - The validation error
   */
  const getError = (errors: IErrors): string => (errors ? errors[id] : "");

  /**
   * Gets the inline styles for editor
   * @param {IErrors} errors - All the errors from the form
   * @returns {any} - The style object
   */
  const getEditorStyle = (errors: IErrors): any =>
  getError(errors) && getError(errors).replace(/\s/g, '') ? { borderColor: "red" } : {};
  
  const renderTimeFields = (context?: IFormContext) => {
    const time = context!.values[id] ? context!.values[id] : 0;
    const timeObject = msToHMS(time);
    return Object.keys(timeObject).map(unit => (
      <>
        <input
          id={`${id}${unit}`}
          type="number"
          style={getEditorStyle(context ? context.errors : {})}
          value={timeObject[unit]}
          placeholder={placeholder}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) =>
              context!.setValues((() => {
                const { [unit]: omitted, ...rest } = timeObject;
                const ms = hMSToMs({ [unit]: e.currentTarget.value, ...rest});
                return { [id]: Number(ms)};
              })())
          }
          onBlur={
            (e: React.FormEvent<HTMLInputElement>) =>
              context!.validate(id)
          }
          className="form-control"
        />
        <span>{unit}</span>
      </>
    ))
  }

  return (
    <FormContext.Consumer>
    {(context: (IFormContext | undefined)) => (
    <div className="form-group" style={containerStyle}>
      {label && <label htmlFor={id}>{label}</label>}

        {/*see for refacto this ?*/}
        {/*{editor!.toLowerCase() === "wyziwyg" && (*/}
        {/*    <DraftEditor*/}
        {/*        html={context!.values[id]}*/}
        {/*        onChange={(html: string) => {*/}
        {/*            console.log('[FieldComponent] - wyziwyg - change - ', html)*/}
        {/*            context!.setValues({ [id]: html })*/}
        {/*        }}*/}
        {/*    />*/}
        {/*)}*/}

      {editor!.toLowerCase() === "textbox" && (
        <input
          id={id}
          type="text"
          style={getEditorStyle(context ? context.errors : {})}
          value={context!.values[id]}
          placeholder={placeholder}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.setValues({ [id]: e.currentTarget.value }) 
          }
          onBlur={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.validate(id)
          }
          className="form-control"
        />
      )}

    {editor!.toLowerCase() === "password" && (
        <input
          id={id}
          type="password"
          style={getEditorStyle(context ? context.errors : {})}
          value={context!.values[id]}
          placeholder={placeholder}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.setValues({ [id]: e.currentTarget.value }) 
          }
          onBlur={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.validate(id)
          }
          className="form-control"
        />
      )}  

      {editor!.toLowerCase() === "multilinetextbox" && (
        <textarea
          id={id}
          value={context!.values[id]}
          placeholder={placeholder}
          style={getEditorStyle(context ? context.errors : {})}
          onChange={
            (e: React.FormEvent<HTMLTextAreaElement>) =>
            context!.setValues({ [id]: e.currentTarget.value }) 
          }
          onBlur={
            (e: React.FormEvent<HTMLTextAreaElement>) =>
                context!.validate(id)
          }
          className="form-control"
        />
      )}

      {editor!.toLowerCase() === "number" && (
        <input
          id={id}
          type="number"
          style={getEditorStyle(context ? context.errors : {})}
          value={context!.values[id]}
          placeholder={placeholder}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.setValues({ [id]: Number(e.currentTarget.value) }) 
          }
          onBlur={
            (e: React.FormEvent<HTMLInputElement>) =>
                context!.validate(id)
          }
          className="form-control"
        />
      )}

      {editor!.toLowerCase() === "time" && (
        <div className="time">
          {renderTimeFields(context)}
        </div>
      )}

      {editor!.toLowerCase() === "dropdown" && (
        <select
          id={id}
          name={id}
          value={context!.values[id]}
          style={getEditorStyle(context ? context.errors : {})}
          // defaultValue={context!.values[id] || placeholder}
          onChange={
            (e: React.FormEvent<HTMLSelectElement>) =>
            context!.setValues({ [id]: e.currentTarget.value }) 
          }
          onBlur={
            (e: React.FormEvent<HTMLSelectElement>) =>
              context!.validate(id)
          }
          className="form-control"
        >
          {/* select default value */}
          {(() => {
            console.log('[FieldComponent] - dropdown - options and current value ', options, context!.values[id])
            const selectedOption = options && options.find(option => option === (context!.values[id]))
            console.log('[FieldComponent] - dropdown - selectedOption', selectedOption)
            return selectedOption 
            ? (<option key={selectedOption} value={selectedOption}>{selectedOption}</option>)
            : (<option value={placeholder} key={""}>{placeholder}</option>)
          })()
          }
          {options &&
            options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}

      {editor!.toLowerCase() === "entitydropdown" && (
        <select
          id={id}
          name={id}
          style={getEditorStyle(context ? context.errors : {})}
          onChange={
            (e: React.FormEvent<HTMLSelectElement>) => {
              console.log('[FieldComponent] - entitydropdown change - ', e.currentTarget.value)
              const selectedOption = entityOptions && entityOptions.find(option => option.value === e.currentTarget.value)
              context!.setValues({ [id]: selectedOption && selectedOption.key}) // add key (wich is normally an object id) to the form values
            }
          }
          onBlur={
            (e: React.FormEvent<HTMLSelectElement>) =>
              context!.validate(id)
          }
          className="form-control"
        >
          {/* select default value */}
          {(() => {
            const selectedOption = entityOptions && entityOptions.find(option => option.key === (context!.values[id]))
            console.log('[FieldComponent] - entitydropdown - selectedOption', selectedOption)
            return selectedOption 
            ? (<option key={context!.values[id]} value={selectedOption && selectedOption.value}>{selectedOption && selectedOption.value}</option>)
            : (<option value={placeholder} key={""}>{placeholder}</option>)
          })()
          }

          {entityOptions &&
            entityOptions.map(option => (
              <option key={option.key} value={option.value}>
                {option.value}
              </option>
            ))}
        </select>
      )}

    {editor!.toLowerCase() === "multientitydropdown" && (
      <div>
        {console.log('[FieldComponent] - multientitydropdown values', context!.values[id])}
        <Multiselect
          id={id}
          textField='value'
          valueField='key'
          data={entityOptions}
          defaultValue={context!.values[id]}
          value={context!.values[id]}
          
          onChange={(dataItems: any, metadata: any) => {
            console.log('[FieldComponent] - multientitydropdown change - ', dataItems)
            context!.setValues({ [id]: dataItems.map((item: IEntityDropdownOption) => item.key) })
            setTimeout( () => {
              context!.validate(id)
            }, 300)
          }}
        >

        </Multiselect>
      </div>
        
      )}

      {editor!.toLowerCase() === "video" && (
        <div className="video-input" >
          <input 
            id={id}
            type="file"
            style={getEditorStyle(context ? context.errors : {})}
            value={value}
            onChange={
              (onChangeEvent) => {
                console.log(`[FieldComponent] - video picker - onChangeEvent `, onChangeEvent.target.files)
                if (onChangeEvent.target.files && onChangeEvent.target.files[0]) {
                  console.log(onChangeEvent.target.files[0])
                  context!.setValues({ [id]: onChangeEvent.target.files[0] })

                } else {
                  context!.setValues({ [id]: "" }) 
                }
              }
            }
            onBlur={
              (e: React.FormEvent<HTMLInputElement>) =>
                  context!.validate(id)
            }
            className="form-control"
          />
        </div>
      )

      }

      {editor!.toLowerCase() === "image" && (
        <div className="img-input">
          <input
            id={id}
            type="file"
            style={getEditorStyle(context ? context.errors : {})}
            value={value}
            onChange={
              (onChangeEvent) => {
                console.log('[FieldComponent] - image picker - onChangeEvent ', onChangeEvent.target.files)
                if (onChangeEvent.target.files && onChangeEvent.target.files[0]) {
                  console.log(onChangeEvent.target.files[0])
                  context!.setValues({ [id]: onChangeEvent.target.files[0] }) 
      
                  const FR = new FileReader();
                  
                  FR.addEventListener("load", function(e: any) {
                    if (e && e.target) {
                      const imgHtmlElement = document.getElementById(id + "img") as HTMLImageElement
                      if (imgHtmlElement) imgHtmlElement.src = e.target.result
                    }
                  }); 
                  
                  FR.readAsDataURL( onChangeEvent.target.files[0] );
                } else {
                  const imgHtmlElement = document.getElementById(id + "img") as HTMLImageElement
                  if (imgHtmlElement) imgHtmlElement.src = ""
                  context!.setValues({ [id]: "" }) 
                }
              }
            }
            onBlur={
              (e: React.FormEvent<HTMLInputElement>) =>
                  context!.validate(id)
            }
            className="form-control"
          />
          <div className="input-img-container">
            <img id={id + "img"} src={(() => {
              if (context!.values[id] && (typeof context!.values[id] == 'string') && context!.values[id].startsWith('/uploads/images/')) {
                return `${API_URL}${context!.values[id]}`
              }
            })()}></img>          
          </div>
        </div>
      )}

      {editor!.toLowerCase() === "checkbox" && (
          <input 
            id={id}
            type="checkbox"
            checked={context!.values[id]}
            style={getEditorStyle(context ? context.errors : {})}
            onChange={
              (e: React.FormEvent<HTMLInputElement>) => {
                console.log(e.currentTarget.value )
                  context!.setValues({ [id]: e.currentTarget.checked }) }
            }
            onBlur={
              (e: React.FormEvent<HTMLInputElement>) =>
                  context!.validate(id)
            }
            className="form-control"
          ></input>
      )}

      {editor!.toLowerCase() === "date" && (
        <DatePicker
          selected={context!.values[id] ? moment(context!.values[id]).toDate() : null}
          onChange={(date: Date) => {
            context!.setValues({ [id]: date }) 
          }}
          onBlur={() => context!.validate(id)}
          locale='fr'
          dateFormat='dd/MM/yyyy'
          isClearable={true}
          placeholderText={placeholder}
        />
      )}

      {children}

      {context && getError(context.errors) && (
        <div style={{ color: "red", fontSize: "80%" }}>
          <p className="form-group-error">{getError(context.errors)}</p>
        </div>
      )}
    </div>
    )}
    </FormContext.Consumer>
  );
};
Field.defaultProps = {
  editor: "textbox"
};
