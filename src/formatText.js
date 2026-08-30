/**
 * formatText function
 * Copyright (C) 2026 Carlos Henrique Reche <carlosreche@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://gnu.org>.
 */
export default function formatText(text, options = {}) {
  if (typeof text !== 'string') {
    return null;
  }
  let { mode = 'proper', trimEdges = true, normalizeSpaces = true, removeNewlines = true,
        lowercaseWords = null, language = null } = options;
  let formattedText = text;

  if (trimEdges) {
    formattedText = formattedText.trim();
  }
  if (removeNewlines) {
    formattedText = formattedText.replace(/[\r\n]+/g, ' ');
  }
  if (normalizeSpaces) {
    formattedText = formattedText.replace(/(\s)\s+/g, '$1');
  }

  switch (mode) {
    case 'upper': return formattedText.toUpperCase();
    case 'lower': return formattedText.toLowerCase();
    case 'first': 
      return formattedText.toLowerCase().replace(/^([^\p{L}]*)(\p{L})/u,
        (all, before, firstLetter) => (before + firstLetter.toUpperCase())
      );
    case 'capitalize':
      return formattedText.toLowerCase().replace(/(^|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu,
        (all, before, word, firstLetter, remaining) => (before + firstLetter.toUpperCase() + remaining)
      );
    case 'proper':
    default:
  }
  
  let isLowercaseWord;
  if (typeof lowercaseWords === 'string') {
    isLowercaseWord = word => (word === lowercaseWords);
  } else if (lowercaseWords instanceof RegExp) {
    isLowercaseWord = word => lowercaseWords.test(word);
  } else {
    if (!Array.isArray(lowercaseWords)) {
      language = ((typeof language === 'string') ? language : navigator?.language)?.trim().toLowerCase().split('-')[0];
      switch (language) {
        case 'pt':
          lowercaseWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'em', 'por', 'com', 'para', 'sob', 'sobre', 'até', 'sem', 'do', 'da', 'dos', 'das', 'no', 'na', 'nos', 'nas', 'pelo', 'pela', 'pelos', 'pelas', 'ao', 'aos', 'e', 'nem', 'mas', 'porém', 'contudo', 'todavia', 'entretanto', 'ou', 'logo', 'pois', 'portanto', 'porque', 'que'];
          break;
        case 'en':
          lowercaseWords = ['of', 'and', 'the', 'in', 'to', 'for', 'with', 'on', 'at', 'by', 'from', 'a', 'an', 'or', 'but'];
          break;
        case 'es':
        case 'spa':
          lowercaseWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'lo', 'del', 'al', 'a', 'ante', 'bajo', 'con', 'contra', 'de', 'desde', 'durante', 'en', 'entre', 'hacia', 'hasta', 'mediante', 'para', 'por', 'según', 'sin', 'sobre', 'tras', 'vía', 'y', 'e', 'o', 'u', 'pero', 'sino', 'porque', 'aunque', 'si', 'ni'];
          break;
        default:
          lowercaseWords = [];
      }
    }
    isLowercaseWord = word => lowercaseWords.some(lcWord => {
      if (typeof lcWord === 'string') return (word === lcWord);
      if (lcWord instanceof RegExp) return lcWord.test(word);
      return false;
    });
  }
  const replaceFunction = (all, before, word, firstLetter, remaining) => {
    if (isLowercaseWord(word) && /\s$/.test(before) && !/[.!?¡¿]\s+$/.test(before)) {
      return all;
    }
    return (before + firstLetter.toUpperCase() + remaining);
  };
  return formattedText.toLowerCase().replace(/(^|[^\p{L}]+)((\p{L})((\p{L}|-\p{L})*))/gu, replaceFunction);
}
