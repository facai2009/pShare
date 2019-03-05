import * as React from 'react';
import styled from 'styled-components';
import back_arrow_svg from '../../assets/svgs/back-nav-arrow.svg';

interface ButtonProps {
  align?: string,
  primary?: boolean,
  theme?: { blue: string },
  direction?: string,
  width?: string,
  minHeight?: string,
  fontSize?: string,
  margin?: string,
}

interface ArrowButtonProps {
  label: string,
  onClick?: () => void,
  type?: string,
  disabled?: boolean,
  focus?: boolean
}

const StyledButton = styled('button') <ButtonProps>`
  align-self: ${(props) => props.align ? props.align : 'center'};
  justify-content: center;
  min-width: ${(props)=> props.width || '218px'};
  min-height: ${(props)=> props.minHeight || '2em'};
  font-size: ${(props)=> props.fontSize || '1em'};
  background: ${(props) => props.primary ? props.theme.blue : 'white'} ;
  border-radius: 3px;
  border: 1px solid ${(props) => props.primary ? '#0073e6' : '#d2d2d2'};
  color: ${props => props.primary ? 'white'  : props.theme.blue};
  margin: ${props=> props.margin || '0 0 0 0'};
  padding: 0.5em 1em;
  cursor: pointer;
`
const LightButton = styled('button')<ButtonProps>`
  align-self: ${(props) => props.align ? props.align : 'center'};
  justify-content: center;
  min-width:218px;
  min-height: 2em;
  font-size:1em ;
  background: white ;
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.blue};
  color: ${(props) => props.theme.blue};
  /* margin: 0.5em 1em; */
  margin: 0 0 0 0;
  padding: 0.5em 1em;
  cursor: pointer;
`

const StyledBackArrowButton = styled('div')`
  display: block;
  direction: column;
  width: 100px;
  cursor: pointer;
`


const BackArrowButton: React.FunctionComponent<{ onClick: () => void }> = ({ onClick }) => (
  <StyledBackArrowButton onClick={() => onClick()}>
    <img src={back_arrow_svg} style={{ marginTop: '175%'}} />
  </StyledBackArrowButton>
)
const ArrowButton:React.FunctionComponent<ArrowButtonProps> = ({ label, onClick, type, disabled, focus }) => (
  <StyledButton autoFocus={focus} onClick={onClick} primary direction="row-reverse" align="flex-end" type={type} disabled={disabled} >
      {label} <span style={{float:"right"}}>&#8594;</span>
  </StyledButton>
)


export default StyledButton

export { ArrowButton, BackArrowButton, LightButton };

