import React from 'react'

export default function ({visibleCount, total}) {

   return (
      <div className="map__counter counter">
         <p>Найдено: {visibleCount} из {total}</p>
      </div>
   )

}