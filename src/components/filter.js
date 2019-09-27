import React from 'react'
import Select from 'react-select'

export default class extends React.Component {

   state = {

   }

   render() {
      let {count, setFilter} = this.props;

      const options = [
         { value: 'Все теремки', label: `Все теремки (18)` },  // Костыль, не получилось сделать через count.all
         { value: 'Ресторан с залом', label: `Ресторан с залом (${count.type1})` },
         { value: 'Ресторанный дворик', label: `Ресторанный дворик (${count.type2})` },
         { value: 'Кафе', label: `Кафе (${count.type3})` },
         { value: 'Уличный киоск', label: `Уличный киоск (${count.type4})` }
      ];

      const selectStyle = {
         indicatorsContainer: () => null,
         dropdownIndicator: () => null,
         control: (styles) => ({
            ...styles,
            borderColor: 'black',
            borderRadius: '18px',
            boxShadow: 'none',
            height: '32px',
            minHeight: '32px',
            fontFamily: 'Montserrat Semibold',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.83px',
            ':hover': {
               borderColor: 'black',
            },
            ':focus': {
               borderColor: 'black',
            },
            className: 'some'

         }),
         option: (styles, state) => ({
            ...styles,
            display: 'inline-block',
            color: 'black',
            backgroundColor: state.isSelected ? '#ccc' : state.isFocused ? '#f6f5f4 ': 'white',
            cursor: 'pointer',
            fontFamily: 'Montserrat Semibold',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.83px',  
            ':active': {
               backgroundColor: 'transparent',
            },         
         }),
         menu: (styles) => ({
            ...styles,
            textAlign: 'center',
            display: 'block'
         })
      }

      return (
         <div className="map__filterblock filter">
            <Select
               className="filter__select"
               options={options}
               styles={selectStyle}
               onChange={setFilter}
               defaultValue={options[0]}
               isSearchable={false}
         />
            <svg className="icon filter__icon-caret">
               <use xlinkHref="assets/svg-sprite/icons.svg#static-mobile"></use>
            </svg>
         </div>
      )
   }
}