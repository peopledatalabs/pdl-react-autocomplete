<h1 align="center">PDL React Autocomplete</h1>
<p align="center">
  <a href="">
    <img src="https://img.shields.io/badge/repo%20status-Active-limegreen" alt="Repo Status">
  </a>&nbsp;
  <a href="https://www.npmjs.com/pdl-react-autocomplete">
    <img src="https://img.shields.io/npm/v/pdl-react-autocomplete.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen" alt="PDL React Autocomplete" />
  </a>&nbsp;
</p>

This library allows users to search the PDL Autocomplete API for valid Search API query values within a specific field along with the number of available records for each suggestion, receive autocompetion suggestions in a drop down of options, and then select a suggestion to be passed into a callback function.

<p align="center">
  <img src="https://user-images.githubusercontent.com/103519873/167505702-34fc2580-1ea3-47a4-83f0-c9f5a6fb6aeb.gif"/>
</p>

For example, a user queries the 'company' field with the text of 'goog' as a search term, and the autocomplete component will show a dropdown of options that most closely match this search, such as 'google'. The user either clicks or uses their keyboard to select 'google', and 'google' gets passed as the argument to a callback function has been passed down to this component as a prop.

## Table of Contents
- [🔧 Installation](#installation)
- [🚀 Usage](#usage)
- [📘 Documentation](#documentation)
- [🔒 Security Disclaimer](#security)

## 🔧 Installation <a name="installation"></a>

1. Pull the package from the npm repository:

```bash
yarn add pdl-react-autocomplete
```
or
```bash
npm i pdl-react-autocomplete
```

2. Sign up for a [free PDL API key](https://www.peopledatalabs.com/signup)

## 🚀 Usage <a name="usage"></a>

First, import the component library:
```js
import Autocomplete from 'pdl-react-autocomplete';
```

Then, use the library like any other React component:
```js
  return (
    <div className="App">
      <Autocomplete
        field={'company'}
        size={5}
        onTermSelected={(term) => console.log('onSelectedTerm', term)}
        apiKey={'insertKeyHere'}
      />
    </div>
  );
```

## 📘 Documentation <a name="documentation"></a>
The Autocomplete API endpoint is documented here: https://docs.peopledatalabs.com/docs/autocomplete-api

### Props
1. **field** (required)
    - The field input parameter specifies which type of field to run autocomplete for. The fields supported by the Autocomplete API map to a subset of the Person Schema fields.
      - The list of all valid arguments is:
        1. company
        2. country
        3. industry
        4. location
        5. major
        6. region
        7. role
        8. school
        9. sub_role
        10. skill
        11. title

    - Each field argument value for the Autocomplete API maps to a specific subset of Person Schema fields. To see the exact mappings, visit the [Autocomplete API Input Parameters](https://docs.peopledatalabs.com/docs/input-parameters-autocomplete-api) documentation

2. **onTermSelected** (required)
    - Callback function to be executed on the text of the input, but only as a result of selecting an autocompletion suggestion by mouse click or the 'enter' key.

3. **API Key** (required)
    - PDL API Key required to avoid a 401 error.

4. **size**
    - Number of results returned for autocompletion. Must be between 1 and 100. Set to 10 by default.

### Styling
Refer to the styles in this [css file](https://github.com/peopledatalabs/pdl-react-autocomplete/blob/first/src/index.css) and override the styling of an existing class by creating a new code block with the same class name, but with the '!important' tag.
```css
.pdl-suggestion {
    width: 100%;
    padding: .5rem;
    justify-content: space-between;
}

/* your styling override */
.pdl-suggestion {
    background-color: red !important;
}
```

## 🔒 Security Disclaimer <a name="security"></a>
This library should be used as an internal tool or as a proof of concept as it fires off requests to the PDL Autocomplete API from the client.  This is due to the nature of being a react component and API Keys being all encompassing at PDL.  We highly suggest referencing the component's code base for spinning up your own version but accessing the PDL Autocomplete API via a proxy server and not using this in a public production environment.
