import * as React from "react"
import {IFieldProps, IValidation} from "./Field/field.component"
import Button from "../Button/button.component"
import './form.component.scss';
import {connect} from 'react-redux';

const API_URL = process.env.REACT_APP_API_URL;


/**
 * Validates whether a field has a value
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const required = (values: IValues, fieldName: string): string => {
  console.log('[FormComponent] - required validator - ', fieldName, values[fieldName]);
  return values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === "" ||
  values[fieldName].length === 0
    ? "This must be populated"
    : ""
};


/**
 * Validates whether a field is a valid email
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isEmail = (values: IValues, fieldName: string): string =>
  values[fieldName] &&
  values[fieldName].search(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  )
    ? "This must be in a valid email format"
    : "";

/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {number} length - The maximum number of characters
 * @returns {string} - The error message
 */
export const maxLength = (
  values: IValues,
  fieldName: string,
  length: number
): string =>
  values[fieldName] && values[fieldName].length > length
    ? `This can not exceed ${length} characters`
    : "";

/**
 * Validates whether a field is an image file
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isImage = (
  values: IValues,
  fieldName: string,
): string => {
  return values[fieldName] && values[fieldName].type && !!values[fieldName].type.search('image')
    ? `The file should be an image.`
    : ""
};

/**
 * Validates whether a field is a video file
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isVideo = (
  values: IValues,
  fieldName: string,
): string => {
  return values[fieldName] && values[fieldName].type && !!values[fieldName].type.search('video')
    ? `The file should be a video.`
    : ""
};

/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isUrl = (
  values: IValues,
  fieldName: string,
): string =>
  values[fieldName] && !values[fieldName].match(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
  )
    ? `This must be an url`
    : "";

/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {string} copyFieldName - The field to copy
 * @returns {string} - The error message
 */
export const equalToField = (
  values: IValues,
  fieldName: string,
  copyFieldName: string
): string =>
  values[fieldName] !== values[copyFieldName] && values[copyFieldName]
    ? `Field not equal`
    : "";


/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {number} copyFieldName - The field to copy
 * @returns {string} - The error message
 */
export const equalToValue = (
  values: IValues,
  fieldName: string,
  value: string
): string =>
  values[fieldName] !== value
    ? `This is not correctly filled`
    : "";


export interface IFormContext extends IFormState {
  /* Function that allows values in the values state to be set */
  setValues: (values: IValues) => void

  /* Function that validates a field */
  validate: (fieldName: string) => void
}

/*
* The context which allows state and functions to be shared with Field.
* Note that we need to pass createContext a default value which is why undefined is unioned in the type
*/
export const FormContext = React.createContext<IFormContext | undefined>(
  undefined
);

export interface IFields {
  [key: string]: IFieldProps
}

interface IFormProps {
  ref?: React.RefObject<any>

  /* The action creator that run an api request with the body */
  action: (body: any, token?: string, urlParams?: { [key: string]: string }) => any

  /* The connected user token */
  token?: string

  /* Method called after api call, when receiving a response */
  onActionSuccess: (result: any) => void

  /* Method called after api call, when request failed */
  onActionFailure: (error: any) => void

  /* The props for all the fields on the form */
  fields: IFields

  /* Base values for the form (example : an update form) */
  values?: IValues

  /* Text of the submit button */
  submitText: string

  /* A prop which allows content to be injected */
  render: () => React.ReactNode
}

export interface IValues {
  /* Key value pairs for all the field values with key being the field name */
  [key: string]: any
}

export interface IErrors {
  /* The validation error messages for each field (key is the field name */
  [key: string]: string
}

export interface IFormState {
  /* The field values */
  values: IValues

  /* The field validation error messages */
  errors: IErrors

  /* Whether the form has been successfully submitted */
  submitSuccess?: boolean
}

export class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);

    const errors: IErrors = {};
    const values: IValues = this.props.values ? this.props.values : {};
    console.log('[FormComponent] - base values - ', values);
    this.state = {
      errors,
      values
    }
  }

  componentWillReceiveProps(newProps: IFormProps) {
    console.log('[FormComponent] - will receive props - newProps / state - ', newProps, this.state);
    if (newProps.values !== this.state.values) {
      const values: IValues = newProps.values ? newProps.values : {};
      console.log('[FormComponent] - received form values derived from state - ', values);
      this.setState({values})
    }
  }

  // static getDerivedStateFromProps(props: IFormProps, state: IFormState) {
  //   console.log('[FormComponent] - getDerivedStateFromProps - ', props, state)
  //   if(props.values) {
  //     console.log('AAAAAAAAAAAAAAAAAA', props.values !== state.values)
  //     console.log('BBBBBBBBBBBBBBBBBB', ((Object.values(props.values).length > 0 && Object.values(state.values).length <= 0) || (Object.values(state.values).length > 0 && Object.values(props.values).length <= 0)))
  //   }
  //   if (props.values && props.values !== state.values && ((Object.values(props.values).length > 0 && Object.values(state.values).length <= 0) || (Object.values(state.values).length > 0 && Object.values(props.values).length <= 0))) {
  //     console.log('[FormComponent] - Form Values CHANGGEEEEE')
  //     return {
  //       values: props.values
  //     }
  //   }

  //   return null
  // }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: IFormProps, prevState: IFormState) {
    console.log('[FormComponent] - componentDidUpdate - ', prevProps, this.props, prevState, this.state)

    // if (this.props.values !== prevProps.values) {
    //   this.setValues(this.props.values ? this.props.values : {})
    // }
  }

  componentWillUnmount() {
    this.setState({errors: {}});
    console.log('[FormComponent] - componentWillUnmount')
  }

  /**
   * Executes the validation rule for the field and updates the form errors
   * @param {string} fieldName - The field to validate
   * @returns {string} - The error message
   */
  private validate = (fieldName: string): string => {
    let newErrors: string[] = [];

    if (
      this.props.fields[fieldName] &&
      this.props.fields[fieldName].validation
    ) {
      newErrors = this.props.fields[fieldName].validation!.map((validation: IValidation) => validation.rule(
        this.state.values,
        fieldName,
        validation!.args
      ))
    }

    let newErrorsString = "";
    newErrors.forEach(error => {
      newErrorsString += `${error} `
    });


    this.state.errors[fieldName] = newErrorsString;
    this.setState({
      errors: {...this.state.errors, [fieldName]: newErrorsString}
    });
    return newErrorsString
  };

  /**
   * Executes the validate method for all the fields
   */
  private validateAll() {
    Object.keys(this.props.fields).forEach((fieldKey: string) => this.validate(this.props.fields[fieldKey].id))
  }

  /**
   * Reset the errors property in state to {}
   */
  public resetErrors = () => {
    this.setState({errors: {}})
  };

  /**
   * Stores new field values in state
   * @param {IValues} values - The new field values
   */
  private setValues = (values: IValues) => {
    this.setState({values: {...this.state.values, ...values}})
  };

  /**
   * Returns whether there are any errors in the errors object that is passed in
   * @param {IErrors} errors - The field errors
   */
  private haveErrors(errors: IErrors) {
    let haveError: boolean = false;
    Object.keys(errors).map((key: string) => {
      if (errors[key].replace(/\s/g, '').length > 0) {
        haveError = true
      }
    });
    return haveError
  }

  /**
   * Handles form submission
   * @param {React.FormEvent<HTMLFormElement>} e - The form event
   */
  private handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log('[FormComponent] - handle submit - ', this.state.values);

    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm();
      this.setState({submitSuccess})
    }
  };

  /**
   * Executes the validation rules for all the fields on the form and sets the error state
   * @returns {boolean} - Returns true if the form is valid
   */
  private validateForm(): boolean {
    console.log('[FormComponent] - validating form ...');
    const errors: IErrors = {};
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName)
    });
    this.setState({errors});

    console.log('[FormComponent] - validate form is ok ? ', !this.haveErrors(errors), errors);

    return !this.haveErrors(errors)
  }

  /**
   * Submits the form to the http api
   * @returns {boolean} - Whether the form submission was successful or not
   */
  private async submitForm(): Promise<boolean> {
    console.log('[FormComponent] - submitting form ...');
    const submittedFilesInfos = await this.submitFiles();

    const result = await this.props.action({...this.state.values, ...submittedFilesInfos}, this.props.token);
    // const result = {error:false}
    console.log('[FormComponent] - result of form -', result);
    if (result && result.type.includes('SUCCESS')) {
      this.props.onActionSuccess(result);
    }
    return !result.error
  }

  /**
   * Submits the files to the http api linked with an image or video Field
   * @returns {[key]: string} All the files url, with the linked properties
   */
  private async submitFiles(): Promise<any> {
    console.log(this.props.fields, this.state.values);

    // get the files with linked property name
    const filesInfos = Object.values(this.props.fields)
      .filter((field: IFieldProps) => (field.editor === 'image' || field.editor === 'video') && typeof this.state.values[field.id] == 'object')
      .map((field: IFieldProps) => ({propertyName: field.id, file: this.state.values[field.id]}));

    console.log('[FormComponent] - submitting files ...', filesInfos);

    const uploadedFilesInfos = await Promise.all(filesInfos.map((fileInfo: any) => {
      const formData = new FormData();
      formData.append('file', fileInfo.file);

      return new Promise<any>((resolve, reject) => {
        fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: new Headers({}),
          body: formData
        }).then(
          response => response.json() // if the response is a JSON object
        ).then(
          success => resolve(success) // Handle the success response object
        ).catch(
          error => reject(error) // Handle the error response object
        );
      })
    }));

    console.log(uploadedFilesInfos);
    let submittedFilesInfos = {};
    uploadedFilesInfos.forEach((uploadedFileInfos: any, index: number) => {
      submittedFilesInfos = {
        ...submittedFilesInfos,
        [filesInfos[index].propertyName]: uploadedFileInfos.path.replace('public', '')
      }
    });
    return submittedFilesInfos
  }

  public render() {
    const {submitSuccess, errors} = this.state;

    console.log('[FormComponent] - render - state - ', this.state);
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate,
    };

    console.log('[FormComponent] - context - ', context);
    return (
      <FormContext.Provider value={context}>
        <form onSubmit={this.handleSubmit} noValidate={true}>
          <div className="container">

            {this.props.render()}
            <div className="form-group form-group-submit">
              <Button
                isSubmit={true}
                disabled={this.haveErrors(errors)}
                color="success"
                size="normal"
              >
                {this.props.submitText}
              </Button>
            </div>
            {submitSuccess && (
              <div className="alert alert-info" role="alert">
                The form was successfully submitted!
              </div>
            )}
            {submitSuccess === false &&
            !this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, an unexpected error has occurred
              </div>
            )}
            {submitSuccess === false &&
            this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, the form is invalid. Please review, adjust and try again
              </div>
            )}
          </div>
        </form>
      </FormContext.Provider>

    )
  }
}

const mapStateToProps = (state: any) => ({
  token: state.user.token,
});

export default connect(mapStateToProps, null, null, {forwardRef: true})(Form);
