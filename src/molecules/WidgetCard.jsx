import React from "react";
import Text from "../atoms/Text";

export default function WidgetCard({ title, children, onRemove }) {
  return (
    <div className="
        w-full 
        bg-gray-600 
        p-2 sm:p-4 
        rounded 
        shadow 
        min-w-0             /* Tillader kortet at krympe, hvis viewport er small */
      ">
      {/** Header: Title + Remove-knap **/}
      <div className="flex flex-wrap justify-between items-center">
        <Text
          as="h3"
          size="large"
          color="white"
          className="
            text-lg sm:text-xl 
            font-semibold 
            break-words 
            flex-1 
            min-w-0             /* Sørger for, at tekst kan tikke over i flere linjer i stedet for at tvinge bredde */
          "
        >
          {title}
        </Text>

        {onRemove && (
          <button
            onClick={onRemove}
            className="
              mt-2 sm:mt-0 
              text-red-400 
              text-xs sm:text-sm 
              hover:underline 
              focus:outline-none
            "
          >
            Remove
          </button>
        )}
      </div>

      {/** Indholdsbeholder – gør den scroll‐bar horisontalt ved behov **/}
      <div className="
          mt-2 
          w-full 
          overflow-x-auto   /* Indhold kan scrolle horisontalt i kortet */
          min-w-0            /* Sikrer, at denne container kan skrumpe, hvis dens parent er small */
        ">
        {children}
      </div>
    </div>
  );
}
