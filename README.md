## Commit rule

See [here](https://github.com/bouteillerAlan/Commit-Rule)

## Files architecture rules

Each component and page have a proper folder.

A component is a function or class that is reusable, ideally there is no direct interaction with redux (we will go through the props). 

A page is more or less like a controller, we will call redux in (among others). 

The ``utils.ts`` file in ``config`` folder is used to store some *utils* functions

Example of file architecture : 
```
- back
  |_ next
  |_ node_modules
  |_ pages
  |_ public
  |_ src
      |_ app
      |   |_ assets
      |   |_ components
      |   |   |_ component_a
      |   |   |   |_ component_a.component.tsx
      |   |   |   |_ component_a.component.scss
      |   |   |_ component_b
      |   |       |_ ...    
      |   |_ ducks
      |   |   |_ document_a.duck.ts
      |   |   |_ document_b.duck.ts
      |   |_ pages
      |   |   |_ page_a
      |   |       |_ page_a.page.tsx
      |   |       |_ page_a.page.scss
      |   |   |_ page_b
      |   |       |_ ...      
      |   |_ component_a.module.ts
      |   |_ component_a.service.ts
      |_ config
          |_ configureStore.ts
          |_ utils.ts
```

## Env file
For the development create a ``.env.development`` file in the root of the project.

For the production create a ``.env`` file in the root of the project.

``.env`` content :
```
# application port
PORT=1234
# api url
REACT_APP_API_URL=http://localhost:3001
```

In the code
```ts
const env_url = process.env.REACT_APP_API_URL
```

## Utils function
location : ``src/config/utils.ts``

### msToHMS
transform a date to { h, m, s}
```ts
msToHMS = (date: number): { h, m, s}
```

### hMSToMs
transform a { h, m, s} to a ms
```ts
hMSToMs = ({ h, m, s }: any): ms
```

### slugify
clean a string for create a slug (a seo url part)
```ts
slugify = (string: string): string
```

### addToObject
allow to add an index and value in a specific position in a object
```ts
addToObject = (obj: any, key: string, value: any, index: number): object
```

### logout
clean the localStorage
```ts
logout()
// make a localStorage.clear()
```

## Generic components
location : ``src/app/component/``

### Button
create a button whit different option

**/!\ the css need to be adapted for each project**

props :
```ts
color: 'success' | 'info' | 'important' | 'light' | 'dark';
size: 'large' | 'normal' | 'round';
className?: string;
icon?: JSX.Element; // Put the size to normal to use icon
href?: string; // we consider that the string is slugify (see utils)
isSubmit?: boolean;
disabled?: boolean;
onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
```

### Collapsible
create a full list of collapsible element

props :
```ts
datas: {header: string, text: string}[]
```

### CookieConsent
create a banner for the cookie consent, just need to be imported in the app root 

### Form
allows to create on the fly form

example for an adaptative form :
```ts
const ContactPage: React.FunctionComponent<any> = ({location, sendMail, mailReturn}: ContactPageProps) => {

    let common: IFields = {
        firstName: {
            id: "firstName",
            placeholder: "Nom",
            validation: []
        },
        lastName: {
            id: "lastName",
            placeholder: "Prénom",
            validation: []
        },
        email: {
            id: "email",
            placeholder: "Mail",
            validation: [{ rule: required }, { rule: isEmail }]
        },
        tel : {
            id: "tel",
            placeholder: "Téléphone",
            validation: []
        },
        message: {
            id: "message",
            placeholder: "Message",
            editor: "multilinetextbox",
            validation: [{ rule: required }]
        },
        gdpr: {
            id: "gdpr",
            label: "Je consens à l'envoi des données entrées dans le formulaire.",
            editor: "checkbox",
            validation: [{ rule: required }, { rule: equalToValue, args: true }]
        },
    };

    let fields: IFields;

    if (location.pathname === '/contact/advertiser') {
        fields = addToObject(common, 'advertiser', {id: 'advertiser', placeholder: 'Nom de l\'entreprise', validation: [{ rule: required }] }, 3);
    } else if (location.pathname === '/contact/ong') {
        fields = addToObject(common, 'ong', {id: 'ong', placeholder: 'Nom de l\'ong', validation: [{ rule: required }] }, 3);
    } else {
        fields = common;
    }

    return (
        <section className="contact main-container">
            <EllipseComponent pos={'top'}/>

            <div className="contact_grid">
                <Form
                    action={(body) => ( sendMail({
                        from: body.email,
                        message: body.message,
                        firstName: body.firstName,
                        lastName: body.lastName,
                        ong: body.ong ? body.ong : '',
                        advertiser: body.advertiser ? body.advertiser : '',
                    }) )}
                    fields={fields}
                    onActionSuccess={(response: any) => {}}
                    onActionFailure={(error: any) => {}}
                    submitText="Envoyer"
                    render={() => (
                        <Fragment>
                            {Object.keys(fields).map((field) => (
                                <Field key={field} {...fields[field]} containerStyle={field === 'gdpr' ? {display: 'flex', flexDirection: 'row-reverse', alignItems: 'baseline'} : {}} />
                            ))}
                        </Fragment>
                    )}
                />
            </div>

            <EllipseComponent pos={'bottom'}/>
        </section>
    );

};
```

## Command
### Installation

```
yarn
```

### Running the app
```
# development
yarn start
```
```
# build
yarn build
```
```
# test
yarn test
```
```
# eject
yarn eject
```
