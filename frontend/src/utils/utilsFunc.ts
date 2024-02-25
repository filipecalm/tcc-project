export function formatCPF(inputCPF: string | undefined): string {
    if (typeof inputCPF !== 'string') {
        return '';
    }

    const numericCPF = inputCPF.replace(/\D/g, ''); // Remove caracteres não numéricos
    let formattedCPF = '';

    for (let i = 0; i < numericCPF.length; i++) {
        if (i === 3 || i === 6) {
            formattedCPF += '.';
        } else if (i === 9) {
            formattedCPF += '-';
        }
        formattedCPF += numericCPF[i];
    }

    return formattedCPF;
}

export function formatRG(inputRG: string | undefined): string {
    if (typeof inputRG !== 'string') {
        return '';
    }
    const numericRG = inputRG.replace(/\D/g, '');

    if (numericRG.length === 0) {
        return '';
    }

    const formattedRG = numericRG.replace(/(\d*)(\d{1})$/, '$1-$2');
    return formattedRG;
}


