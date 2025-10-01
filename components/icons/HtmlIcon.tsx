/*
 * App Weaver
 * Copyright (C) 2025 Google LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';

export const HtmlIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 4H4C2.895 4 2 4.895 2 6V18C2 19.105 2.895 20 4 20H20C21.105 20 22 19.105 22 18V6C22 4.895 21.105 4 20 4ZM8.5 15.5H6.5V12.5H8.5V15.5ZM13.25 15.5H11.25L10.5 13.25L9.75 15.5H7.75L6.25 10.5H8.375L9.25 13.25L10 10.5H10.75L11.5 13.25L12.375 10.5H14.5L13.25 15.5ZM18.5 14.5H15.5V10.5H18.5V11.75H16.75V12.75H18.5V14.5Z" />
  </svg>
);