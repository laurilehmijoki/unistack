import React from 'react'
import Bacon from 'baconjs'
import classnames from 'classnames'
import request from 'superagent-bluebird-promise'

// TODO document

const renderForm = applicationState =>
    <form method="post" action="/sign-in" onSubmit={evt => {
            evt.preventDefault()
            formSubmit.push()
        }}>
        <fieldset>
            {
                Object.keys(applicationState.form).map((inputKey, index) => {
                    const formInput = applicationState.form[inputKey]
                    const hasValue = formInput.value
                    const hasErrors = formInput.errors.length > 0
                    const hasNoErrors = !hasErrors
                    return (
                        <section key={index}>
                            <label>{formInput.label}</label>
                            <input
                                type={formInput.inputType}
                                placeholder={
                                    formInput.placeholder ?
                                        formInput.placeholder + (!formInput.required ? ' (optional)' : '')
                                        :
                                        !formInput.required ? 'optional' : ''
                                }
                                className={classnames({
                                    'value-is-valid': formInput.required ? hasValue && hasNoErrors : hasNoErrors,
                                    empty: !hasValue,
                                    required: formInput.required
                                })}
                                onChange={evt => formInputBus.push({inputKey, ...formInput, value: evt.target.value})}/>
                            {
                                applicationState.showErrors && hasErrors ?
                                    formInput.errors.map((error, errorIndex) =>
                                        <div className="error" key={errorIndex}>{error}</div>
                                    )
                                    :
                                    undefined
                            }
                        </section>
                    )
                })
            }
            <button type="submit">Sign me up, Scotty!</button>
        </fieldset>
    </form>
export const renderPage = applicationState =>
    <body>
        <h1>Sign up</h1>
        {
            applicationState.submitSucceeded ?
                <h2>Thanks for signing up!</h2>
                :
                renderForm(applicationState)
        }
    </body>

const formInputSettings = {
    name: {
        label: 'Name',
        inputType: 'text',
        errors: [],
        required: true,
        resolveErrors: input => input.length < 3 ? ['Your name is too short'] : []
    },
    email: {
        label: 'Email',
        inputType: 'email',
        errors: [],
        required: false,
        resolveErrors: input => input.match(".+@.+") ? [] : ['Invalid email']
    },
    creditCard: { // TODO why this jumps on input?
        label: 'Credit card number',
        inputType: 'text',
        errors: [],
        required: true,
        resolveErrors: input =>
            input ?
                Bacon.fromPromise(request.get(`/api/credit-cards/${input}`)).map('.body.errors')
                :
                ['Please enter your credit card number']
    },
    dayOfBirth: {
        label: 'Day of birth',
        placeholder: 'e.g., 31',
        inputType: 'number',
        errors: [],
        required: true,
        resolveErrors: input => {
            switch (true) {
                case /^\d{1,2}$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= 31: return []
                default: return ['Invalid day of birth']
            }
        }
    },
    monthOfBirth: {
        label: 'Month of birth',
        placeholder: 'e.g., 12',
        inputType: 'number',
        errors: [],
        required: true,
        resolveErrors: input => {
            switch (true) {
                case /^\d{1,2}$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= 12: return []
                default: return ['Invalid month of birth']
            }
        }
    },
    yearOfBirth: {
        label: 'Year of birth',
        placeholder: 'e.g., 1975',
        inputType: 'number',
        errors: [],
        required: true,
        resolveErrors: input => {
            switch (true) {
                case /^\d{4}$/.test(input) && parseInt(input) > new Date().getFullYear() - 18 : return ['You are too young to sign up']
                case /^\d{4}$/.test(input) && parseInt(input) < new Date().getFullYear() - 125: return ['You are too ancient to sign up']
                case /^\d{4}$/.test(input) && parseInt(input) <= new Date().getFullYear() - 18: return []
                default: return ['Invalid day of birth']
            }
        }
    }
}

export const initialState = {
    form: formInputSettings
}

export const pagePath = '/'

export const pageTitle = 'Sign up'

const formInputBus = new Bacon.Bus()
const formSubmit = new Bacon.Bus()

const formStateProperty = Bacon
    .update(
        formInputSettings,
        formSubmit, formState => formState,
        formInputBus, (formState, {inputKey, ...formInput}) => (
            {...formState, [inputKey]: formInput}
        )
    )
    .changes()
    .flatMapLatest(formState =>
        Bacon
            .fromArray(Object.keys(formState))
            .flatMap(inputKey => {
                const {value, ...formInput} = formState[inputKey]
                const inputSetting = formInputSettings[inputKey]
                const requiredInputMissingError = inputSetting.required && !value ? [`Please enter ${inputKey}. It's required.`] : undefined
                const resolvedErrors = inputSetting.resolveErrors(value || '')
                const formInputWithErrors = errors => ({
                    ...formInput,
                    errors: requiredInputMissingError ? requiredInputMissingError : errors,
                    inputKey,
                    value
                })
                return resolvedErrors instanceof Bacon.Observable ?
                    resolvedErrors.map(formInputWithErrors)
                    :
                    formInputWithErrors(resolvedErrors)
            })
            .fold(
                {},
                (memo, {inputKey, ...formInput}) => ({...memo, [inputKey]: formInput})
            )
    )

const formSubmitFailed = formStateProperty
    .sampledBy(formSubmit) // TODO server-side validation
    .map(formState =>
        Object.keys(formState).filter(inputKey => formState[inputKey].errors.length > 0).length > 0
    )

export const applicationStateProperty = initialState => Bacon.update(
    initialState,
    formStateProperty.toEventStream(), (applicationState, formState) => (
        {...applicationState, form: formState}
    ),
    formSubmitFailed, (applicationState, submitFailed) => (
        {...applicationState, showErrors: submitFailed, submitSucceeded: !submitFailed}
    )
).doLog('application state')
