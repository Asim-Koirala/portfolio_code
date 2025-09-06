'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority
const UtilityLayout = dynamic(() => import('../../../components/UtilityLayout'), { loading: () => <div className="min-h-screen"></div> });

// AD to BS conversion logic
const nepaliYearStart = 2000; // BS
const englishYearStart = 1943; // AD

// Days in each month of the Nepali year
const nepaliMonthDays: { [key: number]: number[] } = {
  2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2029: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2045: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2049: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2053: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2055: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2056: [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
  2057: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2058: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2059: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2060: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2062: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
  2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2066: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
  2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
  2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2072: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2074: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2078: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
  2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
  2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
};

// Nepali month names with Unicode equivalents
const nepaliMonths = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Nepali month names in Unicode
const nepaliMonthsUnicode = [
  'बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
];

// English month names
const englishMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Day names in English and Nepali Unicode
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNamesUnicode = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];

// Convert AD to BS
function convertADToBS(adDate: Date): { year: number; month: number; day: number; monthName: string } {
  const adYear = adDate.getFullYear();
  const adMonth = adDate.getMonth() + 1; // JavaScript months are 0-based
  const adDay = adDate.getDate();

  // Check if the date is in range
  if (adYear < englishYearStart || adYear > 2033) {
    throw new Error('Date out of range');
  }

  // Calculate the total number of days from the base date
  let totalEnglishDays = 0;

  // Days from base year to the year before the given year
  for (let i = englishYearStart; i < adYear; i++) {
    totalEnglishDays += isLeapYear(i) ? 366 : 365;
  }

  // Days from the beginning of the given year to the given date
  for (let i = 1; i < adMonth; i++) {
    totalEnglishDays += getDaysInEnglishMonth(i, adYear);
  }
  totalEnglishDays += adDay - 1;

  // Reference date is 1943 April 14 Wednesday (1 Baisakh 2000 BS)
  // Adjust for the reference date (1943/4/14 = 2000/1/1 BS)
  const referenceEnglishDays = 103; // Days from 1943/1/1 to 1943/4/14
  totalEnglishDays -= referenceEnglishDays;

  // Calculate the Nepali date
  let bsYear = nepaliYearStart;
  let bsMonth = 1;
  let bsDay = 1;

  // Deduct days from total days to find the BS date
  while (totalEnglishDays > 0) {
    // Get days in current Nepali month
    const daysInMonth = nepaliMonthDays[bsYear][bsMonth - 1];
    
    if (totalEnglishDays >= daysInMonth) {
      totalEnglishDays -= daysInMonth;
      bsMonth++;
      
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    } else {
      bsDay += totalEnglishDays;
      totalEnglishDays = 0;
    }
  }

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    monthName: nepaliMonths[bsMonth - 1]
  };
}

// Convert BS to AD
function convertBSToAD(bsYear: number, bsMonth: number, bsDay: number): { year: number; month: number; day: number; monthName: string } {
  // Check if the date is in range
  if (bsYear < nepaliYearStart || bsYear > 2090 || bsMonth < 1 || bsMonth > 12) {
    throw new Error('Date out of range');
  }

  // Check if the day is valid for the given month and year
  if (!nepaliMonthDays[bsYear] || bsDay < 1 || bsDay > nepaliMonthDays[bsYear][bsMonth - 1]) {
    throw new Error('Invalid day for the given month and year');
  }

  // Reference date: 1943/4/14 AD = 2000/1/1 BS
  const adYear = englishYearStart;
  const adMonth = 4; // April
  const adDay = 14;

  // Calculate days from reference BS date to the given BS date
  let totalDays = 0;

  // Days from reference year to the year before the given BS year
  for (let i = nepaliYearStart; i < bsYear; i++) {
    for (let j = 0; j < 12; j++) {
      totalDays += nepaliMonthDays[i][j];
    }
  }

  // Days from the beginning of the given BS year to the given BS date
  for (let i = 1; i < bsMonth; i++) {
    totalDays += nepaliMonthDays[bsYear][i - 1];
  }
  totalDays += bsDay - 1; // -1 because we're starting from day 1

  // Add the total days to the reference AD date
  const date = new Date(adYear, adMonth - 1, adDay);
  date.setDate(date.getDate() + totalDays);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    monthName: englishMonths[date.getMonth()]
  };
}

// Helper function to check if a year is a leap year
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Helper function to get the number of days in an English month
function getDaysInEnglishMonth(month: number, year: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

export default function ADBSConverter() {
  const [adDate, setADDate] = useState<string>('');
  const [bsDate, setBSDate] = useState<{ year: number; month: number; day: number }>({ year: 2080, month: 1, day: 1 });
  const [conversionMode, setConversionMode] = useState<'adToBs' | 'bsToAd'>('adToBs');
  const [resultText, setResultText] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setADDate(formattedDate);
  }, []);

  // Convert AD to BS when AD date changes
  useEffect(() => {
    if (conversionMode === 'adToBs' && adDate) {
      try {
        const date = new Date(adDate);
        const result = convertADToBS(date);
        setBSDate({ year: result.year, month: result.month, day: result.day });
        setResultText(`${result.year} ${result.monthName} ${result.day}`);
        setError('');
      } catch {
        setResultText('');
        setError('Date out of range. Please select a date between 1943 and 2033.');
      }
    }
  }, [adDate, conversionMode]);

  // Convert BS to AD when BS date changes
  useEffect(() => {
    if (conversionMode === 'bsToAd' && bsDate.year && bsDate.month && bsDate.day) {
      try {
        const result = convertBSToAD(bsDate.year, bsDate.month, bsDate.day);
        const formattedDate = `${result.year}-${String(result.month).padStart(2, '0')}-${String(result.day).padStart(2, '0')}`;
        setADDate(formattedDate);
        setResultText(`${result.day} ${result.monthName} ${result.year}`);
        setError('');
      } catch {
        setResultText('');
        setError('Invalid date or date out of range. Please select a valid Nepali date.');
      }
    }
  }, [bsDate.year, bsDate.month, bsDate.day, conversionMode]);
  
  // Generate options for years, months, and days
  const generateYearOptions = (isBS: boolean) => {
    const options = [];
    if (isBS) {
      for (let year = 2000; year <= 2090; year++) {
        options.push(<option key={year} value={year}>{year}</option>);
      }
    } else {
      for (let year = 1943; year <= 2033; year++) {
        options.push(<option key={year} value={year}>{year}</option>);
      }
    }
    return options;
  };
  
  const generateMonthOptions = (isBS: boolean) => {
    const months = isBS ? nepaliMonths : englishMonths;
    return months.map((month, index) => (
      <option key={index + 1} value={index + 1}>{month}</option>
    ));
  };
  
  const generateDayOptions = (isBS: boolean) => {
    const options = [];
    let maxDays;
    
    if (isBS) {
      maxDays = bsDate.year && bsDate.month ? 
        (nepaliMonthDays[bsDate.year] ? nepaliMonthDays[bsDate.year][bsDate.month - 1] : 30) : 30;
    } else {
      const year = parseInt(adDate.split('-')[0]);
      const month = parseInt(adDate.split('-')[1]);
      maxDays = getDaysInEnglishMonth(month, year);
    }
    
    for (let day = 1; day <= maxDays; day++) {
      options.push(<option key={day} value={day}>{day}</option>);
    }
    return options;
  };
  
  // Parse AD date string to year, month, day
  const parseADDate = () => {
    if (!adDate) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    const [year, month, day] = adDate.split('-').map(num => parseInt(num));
    return { year, month, day: day || 1 };
  };
  
  // Format AD date from year, month, day to string
  const formatADDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Handle BS date changes
  const handleBSYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    setBSDate(prev => ({ ...prev, year }));
  };
  
  const handleBSMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    setBSDate(prev => ({ ...prev, month, day: 1 })); // Reset day when month changes
  };
  
  const handleBSDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = parseInt(e.target.value);
    setBSDate(prev => ({ ...prev, day }));
  };
  
  // Handle AD date changes
  const handleADYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value);
    const { month, day } = parseADDate();
    setADDate(formatADDate(year, month, day));
  };
  
  const handleADMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value);
    const { year, day } = parseADDate();
    // Adjust day if it exceeds the max days in the new month
    const maxDays = getDaysInEnglishMonth(month, year);
    const newDay = day > maxDays ? maxDays : day;
    setADDate(formatADDate(year, month, newDay));
  };
  
  const handleADDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = parseInt(e.target.value);
    const { year, month } = parseADDate();
    setADDate(formatADDate(year, month, day));
  };
  


  return (
    <UtilityLayout 
      title="Date Converter"
      description="Convert between Gregorian (AD) and Nepali (BS) calendar dates."
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Conversion Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setConversionMode('adToBs')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${conversionMode === 'adToBs' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                AD to BS
              </button>
              <button
                type="button"
                onClick={() => setConversionMode('bsToAd')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${conversionMode === 'bsToAd' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
              >
                BS to AD
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-center">
            {conversionMode === 'adToBs' 
              ? 'Convert Gregorian calendar dates (AD) to Nepali calendar dates (BS).' 
              : 'Convert Nepali calendar dates (BS) to Gregorian calendar dates (AD).'}
          </p>
          
          {/* Input Section */}
          <div className="mb-6">
            {conversionMode === 'adToBs' ? (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Enter AD Date:</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="adYear" className="block text-sm text-gray-600 mb-1">Year</label>
                    <select
                      id="adYear"
                      value={parseADDate().year}
                      onChange={handleADYearChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateYearOptions(false)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="adMonth" className="block text-sm text-gray-600 mb-1">Month</label>
                    <select
                      id="adMonth"
                      value={parseADDate().month}
                      onChange={handleADMonthChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateMonthOptions(false)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="adDay" className="block text-sm text-gray-600 mb-1">Day</label>
                    <select
                      id="adDay"
                      value={parseADDate().day}
                      onChange={handleADDayChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateDayOptions(false)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Enter BS Date:</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bsYear" className="block text-sm text-gray-600 mb-1">Year</label>
                    <select
                      id="bsYear"
                      value={bsDate.year}
                      onChange={handleBSYearChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateYearOptions(true)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bsMonth" className="block text-sm text-gray-600 mb-1">Month</label>
                    <select
                      id="bsMonth"
                      value={bsDate.month}
                      onChange={handleBSMonthChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateMonthOptions(true)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bsDay" className="block text-sm text-gray-600 mb-1">Day</label>
                    <select
                      id="bsDay"
                      value={bsDate.day}
                      onChange={handleBSDayChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 font-medium"
                    >
                      {generateDayOptions(true)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Calendar Display */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Calendar View</h3>
              <div className="calendar-container border border-gray-200 rounded-md overflow-hidden">
                <div className="bg-blue-600 text-white p-3">
                  {/* Year and Month Navigation */}
                  <div className="flex justify-between items-center mb-2">
                    {/* Year Navigation */}
                    <div className="flex items-center">
                      <button 
                        className="text-white hover:bg-blue-700 rounded-full p-1"
                        onClick={() => {
                          if (conversionMode === 'adToBs') {
                            const date = new Date(adDate);
                            date.setFullYear(date.getFullYear() - 1);
                            setADDate(date.toISOString().split('T')[0]);
                          } else {
                            setBSDate(prev => ({ ...prev, year: prev.year - 1 }));
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M8.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <div className="font-bold mx-2">
                        {conversionMode === 'adToBs' 
                          ? parseADDate().year
                          : bsDate.year}
                      </div>
                      
                      <button 
                        className="text-white hover:bg-blue-700 rounded-full p-1"
                        onClick={() => {
                          if (conversionMode === 'adToBs') {
                            const date = new Date(adDate);
                            date.setFullYear(date.getFullYear() + 1);
                            setADDate(date.toISOString().split('T')[0]);
                          } else {
                            setBSDate(prev => ({ ...prev, year: prev.year + 1 }));
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M11.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L15.586 10l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Quick Year Jump */}
                    <div className="flex items-center">
                      <select 
                        className="bg-white text-gray-800 border border-blue-300 p-1 rounded text-sm font-medium shadow-sm"
                        value={conversionMode === 'adToBs' ? parseADDate().year : bsDate.year}
                        onChange={(e) => {
                          const year = parseInt(e.target.value);
                          if (conversionMode === 'adToBs') {
                            const { month, day } = parseADDate();
                            setADDate(formatADDate(year, month, day));
                          } else {
                            setBSDate(prev => ({ ...prev, year }));
                          }
                        }}
                      >
                        {conversionMode === 'adToBs' 
                          ? Array.from({ length: 2034 - 1943 }, (_, i) => 1943 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))
                          : Array.from({ length: 2091 - 2000 }, (_, i) => 2000 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))
                        }
                      </select>
                    </div>
                  </div>
                  
                  {/* Month Navigation */}
                  <div className="flex justify-between items-center">
                    <button 
                      className="text-white hover:bg-blue-700 rounded-full p-1"
                      onClick={() => {
                        if (conversionMode === 'adToBs') {
                          const date = new Date(adDate);
                          date.setMonth(date.getMonth() - 1);
                          setADDate(date.toISOString().split('T')[0]);
                        } else {
                          setBSDate(prev => {
                            let newMonth = prev.month - 1;
                            let newYear = prev.year;
                            if (newMonth < 1) {
                              newMonth = 12;
                              newYear--;
                            }
                            return { ...prev, year: newYear, month: newMonth, day: 1 };
                          });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    <div className="font-bold text-center flex-1 text-lg">
                      {conversionMode === 'adToBs' 
                        ? <span className="text-white">{englishMonths[parseADDate().month - 1]}</span>
                        : <>
                            <span className="text-white">{nepaliMonths[bsDate.month - 1]}</span> <span className="text-sm text-blue-100">({nepaliMonthsUnicode[bsDate.month - 1]})</span>
                          </>}
                    </div>
                    
                    <button 
                      className="text-white hover:bg-blue-700 rounded-full p-1"
                      onClick={() => {
                        if (conversionMode === 'adToBs') {
                          const date = new Date(adDate);
                          date.setMonth(date.getMonth() + 1);
                          setADDate(date.toISOString().split('T')[0]);
                        } else {
                          setBSDate(prev => {
                            let newMonth = prev.month + 1;
                            let newYear = prev.year;
                            if (newMonth > 12) {
                              newMonth = 1;
                              newYear++;
                            }
                            return { ...prev, year: newYear, month: newMonth, day: 1 };
                          });
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 bg-gray-100">
                  {dayNames.map((day, index) => (
                    <div key={day} className={`p-2 text-center text-sm font-medium ${index === 6 ? 'text-red-600 font-bold' : 'text-blue-600'}`}>
                      <div>{day}</div>
                      <div className="text-xs">{dayNamesUnicode[index]}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 p-2 bg-white">
                  {(() => {
                    // Generate calendar days based on the selected date
                    const days = [];
                    let totalDays, startDay;
                    
                    if (conversionMode === 'adToBs') {
                      const date = new Date(adDate);
                      const year = date.getFullYear();
                      const month = date.getMonth();
                      
                      // Get first day of month
                      const firstDay = new Date(year, month, 1);
                      startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
                      
                      // Get total days in month
                      totalDays = new Date(year, month + 1, 0).getDate();
                    } else {
                      // For BS calendar
                      startDay = 0; // Assume Nepali months start on Sunday for simplicity
                      totalDays = nepaliMonthDays[bsDate.year] ? nepaliMonthDays[bsDate.year][bsDate.month - 1] : 30;
                    }
                    
                    // Add empty cells for days before the 1st of the month
                    for (let i = 0; i < startDay; i++) {
                      days.push(
                        <div key={`empty-${i}`} className="p-2 text-center"></div>
                      );
                    }
                    
                    // Add cells for each day of the month
                    for (let i = 1; i <= totalDays; i++) {
                      const isSelected = i === (conversionMode === 'adToBs' ? new Date(adDate).getDate() : bsDate.day);
                      
                      // Calculate day of week and if this day is a Saturday
                      let dayOfWeek = 0;
                      let isSaturday = false;
                      
                      if (conversionMode === 'adToBs') {
                        const date = new Date(parseADDate().year, parseADDate().month - 1, i);
                        dayOfWeek = date.getDay();
                        isSaturday = dayOfWeek === 6;
                        isSaturday = dayOfWeek === 6;
                      } else {
                        // For BS calendar, calculate the day of week
                        // We need to find the corresponding AD date to determine if it's a Saturday
                        try {
                          const adResult = convertBSToAD(bsDate.year, bsDate.month, i);
                          const adDate = new Date(adResult.year, adResult.month - 1, adResult.day);
                          dayOfWeek = adDate.getDay();
                          isSaturday = dayOfWeek === 6;
                          // Day of week calculated
                        } catch {
                          // If conversion fails, just use position in the grid
                          dayOfWeek = (startDay + i - 1) % 7;
                          isSaturday = dayOfWeek === 6;
                          // Day of week calculated
                        }
                      }
                      
                      days.push(
                        <div 
                          key={`day-${i}`} 
                          className={`p-2 text-center cursor-pointer flex flex-col items-center
                            ${isSelected ? 'bg-blue-600 text-white rounded-md' : isSaturday ? 'text-red-600 font-bold' : 'text-gray-700'}`}
                          onClick={() => {
                            if (conversionMode === 'adToBs') {
                              const newDate = new Date(adDate);
                              newDate.setDate(i);
                              setADDate(newDate.toISOString().split('T')[0]);
                            } else {
                              setBSDate(prev => ({ ...prev, day: i }));
                            }
                          }}
                        >
                          <span className="text-md">{i}</span>
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Result Section */}
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>
          ) : (
            <div className="bg-blue-50 p-6 rounded-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {conversionMode === 'adToBs' ? 'BS Date Result:' : 'AD Date Result:'}
              </h2>
              <p className="text-3xl font-bold text-blue-700">{resultText}</p>
            </div>
          )}
          
          {/* Info Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">About Calendar Conversion</h3>
            <p className="text-gray-600 mb-2">
              The Bikram Sambat (BS) calendar is the official calendar of Nepal. It is approximately 56 years and 8.5 months ahead of the Gregorian (AD) calendar.
            </p>
            <p className="text-gray-600">
              The Nepali new year begins in mid-April (around the 13th-14th) of the Gregorian calendar.
            </p>
          </div>
        </div>
      </div>
    </UtilityLayout>
  );
}