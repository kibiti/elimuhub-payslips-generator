// js/app.js
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const weekEndingEl = document.getElementById('weekEnding');
    const paymentDateEl = document.getElementById('paymentDate');
    const generateBtn = document.getElementById('generateBtn');
    const resetBtn = document.getElementById('resetBtn');
    const printBtn = document.getElementById('printBtn');
    const newPayslipBtn = document.getElementById('newPayslipBtn');

    // Set default dates to next Friday
    const setDefaultDates = () => {
        const today = new Date();
        const friday = new Date(today);
        // getDay(): 0 (Sun) .. 6 (Sat). Want next Friday (5).
        const daysUntilFriday = (5 - today.getDay() + 7) % 7 || 7; // next Friday (if today is Friday, go to next week's Friday)
        friday.setDate(today.getDate() + daysUntilFriday);
        weekEndingEl.valueAsDate = friday;
        paymentDateEl.valueAsDate = friday;
    };

    setDefaultDates();

    // Utility: format date in en-GB (dd/mm/yyyy)
    const formatDate = (dateStringOrObj) => {
        const d = dateStringOrObj ? new Date(dateStringOrObj) : new Date();
        if (isNaN(d)) return '____ / ____ / 2025';
        return d.toLocaleDateString('en-GB');
    };

    // Write to preview helper
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = (text === '' || text === null || typeof text === 'undefined') ? '____________________' : text;
    };

    // Generate payslip
    generateBtn.addEventListener('click', function() {
        // Gather inputs
        const weekEnding = weekEndingEl.value;
        const tutorName = document.getElementById('tutorName').value.trim();
        const studentLocation = document.getElementById('studentLocation').value.trim();
        const subjects = document.getElementById('subjects').value.trim();
        const sessionsCompleted = Number(document.getElementById('sessionsCompleted').value) || 0;
        const hoursCompleted = Number(document.getElementById('hoursCompleted').value) || 0;
        const ratePerHour = Number(document.getElementById('ratePerHour').value) || 0;
        const transportAdvance1 = Number(document.getElementById('transportAdvance1').value) || 0;
        const transportAdvance2 = Number(document.getElementById('transportAdvance2').value) || 0;
        const securityDeposit = Number(document.getElementById('securityDeposit').value) || 0;
        const penalties = Number(document.getElementById('penalties').value) || 0;
        const otherAdjustments = Number(document.getElementById('otherAdjustments').value) || 0;
        const otherAdjustmentsNotes = document.getElementById('otherAdjustmentsNotes').value.trim();
        const paymentStatus = document.getElementById('paymentStatus').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentDate = paymentDateEl.value;
        const transactionRef = document.getElementById('transactionRef').value.trim();

        // Calculations
        // Gross = rate * hours
        const grossEarnings = (ratePerHour * hoursCompleted);
        // Total Deductions = sum of all deductions
        const totalDeductions = transportAdvance1 + transportAdvance2 + securityDeposit + penalties + otherAdjustments;
        const netPay = grossEarnings - totalDeductions;

        // Safety: don't show negative net pay as string — show negative with minus sign
        const formatKsh = (val) => {
            if (isNaN(val)) return '____';
            // fixed to 2 decimals
            const sign = val < 0 ? '-' : '';
            return sign + Number(Math.abs(val)).toFixed(2);
        };

        // Update preview fields
        setText('previewWeekEnding', formatDate(weekEnding));
        setText('previewTutorName', tutorName || '____________________');
        setText('previewStudentLocation', studentLocation || '____________________');
        setText('previewSubjects', subjects || '____________________');
        setText('previewSessions', sessionsCompleted || '0');
        setText('previewHours', (hoursCompleted || 0) + ' hrs');
        setText('previewRate', formatKsh(ratePerHour));
        setText('previewTotalHours', hoursCompleted || 0);
        setText('previewGrossEarnings', formatKsh(grossEarnings));
        setText('previewTransport1', formatKsh(transportAdvance1));
        setText('previewTransport2', formatKsh(transportAdvance2));
        setText('previewSecurity', formatKsh(securityDeposit));
        setText('previewPenalties', formatKsh(penalties));
        setText('previewOther', formatKsh(otherAdjustments));
        setText('previewOtherNotes', otherAdjustmentsNotes || '____');
        setText('previewTotalDeductions', formatKsh(totalDeductions));
        setText('previewGross', formatKsh(grossEarnings));
        setText('previewDeductions', formatKsh(totalDeductions));
        setText('previewNetPay', formatKsh(netPay));
        setText('previewPaymentStatus', paymentStatus);
        setText('previewPaymentMethod', paymentMethod);
        setText('previewPaymentDate', 'Friday ' + formatDate(paymentDate));
        setText('previewTransactionRef', transactionRef || '____________________');
        setText('previewSignatureDate', formatDate(new Date()));

        // Visual feedback
        alert('Payslip generated successfully! You can now print or save as PDF (use your browser Print dialog).');
    });

    // Reset form & preview
    resetBtn.addEventListener('click', function() {
        document.getElementById('payslipForm').reset();
        setDefaultDates();

        // Reset preview fields to placeholders
        const placeholders = {
            previewWeekEnding: '____ / ____ / 2025',
            previewTutorName: '____________________',
            previewStudentLocation: '____________________',
            previewSubjects: '____________________',
            previewSessions: '____',
            previewHours: '____ hrs',
            previewRate: '____',
            previewTotalHours: '____',
            previewGrossEarnings: '____',
            previewTransport1: '____',
            previewTransport2: '____',
            previewSecurity: '____',
            previewPenalties: '____',
            previewOther: '____',
            previewOtherNotes: '____',
            previewTotalDeductions: '____',
            previewGross: '____',
            previewDeductions: '____',
            previewNetPay: '____',
            previewPaymentStatus: 'Pending',
            previewPaymentMethod: 'Airtel Money',
            previewPaymentDate: 'Friday ___ / ___ / 2025',
            previewTransactionRef: '____________________'
        };
        Object.keys(placeholders).forEach(k => setText(k, placeholders[k]));
    });

    // Print
    printBtn.addEventListener('click', function() {
        window.print();
    });

    // New payslip (same as reset)
    newPayslipBtn.addEventListener('click', function() {
        resetBtn.click();
    });
});
