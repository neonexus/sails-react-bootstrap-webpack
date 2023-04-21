function defaultAPIErrorHandler(err, resp)  {
    console.error(err.response);

    const errMessage = (resp && resp.errors && resp.errors.problems)
        ? resp.errors.problems.join('\n')
        : (resp && resp.errorMessages) ? resp.errorMessages.join('\n') : 'Unknown Error. Are you connected to the internet?';

    alert(errMessage);
}

export default defaultAPIErrorHandler;
