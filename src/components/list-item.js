import React from 'react'

export default class extends React.Component {

   render() {

      let { item } = this.props

      let distance = item.distance.toFixed().toString()
      let formatedDistance = ''
      for (let i = 0; i < distance.length; i++) {
         formatedDistance += i > 2 ? '0' : distance[i];
      }      

      let metroList = item.metro.map((metro, i) => {
         let classes = `card__metro-item card__metro-item_${metro.color}`;
         return <li key={i} className={classes}>{metro.name}</li>
      })

      return (
         <div className="list__content card">
            <h3 className="card__title">{item.name}</h3>
            <div className="card__about">
               <span className="card__type">{item.class}</span>
               <span className="card__work">{item.work[0]} с {item.work[1]} до {item.work[2]} </span>
            </div>
            <span className="card__distance">{formatedDistance + ' M'}</span>
            <div className="card__location">
               <p className="card__address">{item.address}</p>
               <ul className="card__metro-list">
                  {metroList}
               </ul>
            </div>
            <svg className="icon card__icon-location">
               <use xlinkHref="assets/svg-sprite/icons.svg#menu"></use>
            </svg>
         </div>
      )
   }
}