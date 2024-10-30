import React, {Fragment} from 'react';
import {Pagination} from 'react-bootstrap';

const createButtons = (page, pages) => {
	const from = Math.max(1, page - 2),
		to = Math.min(pages - 1, from + 4),
		buttons = [],
		pushPage = idx => {
			buttons.push(<Pagination.Item key={idx} page={idx} active={page === idx}>{idx + 1}</Pagination.Item>);
		};
		
	buttons.push(<Pagination.Prev key={-1} disabled={page === 0} page={page - 1}/>);
	
	pushPage(0);
	
	if (from > 1) {
		buttons.push(<Pagination.Ellipsis key={1.1} />);
	}
	
	for (let i = from; i < to; i++) {
		pushPage(i);
	}
	
	if (to < pages - 1) {
		buttons.push(<Pagination.Ellipsis key={pages -1 + 0.1} />);
	}
	
	pushPage(pages - 1);
	
	buttons.push(<Pagination.Next key={pages} disabled={page === pages - 1} page={page + 1}/>);
	
	return buttons;
}

const findLinkElement = rootElement => {
	if (rootElement.classList.contains('page-link')) {
		return rootElement;
	}
	const pageLinks = rootElement.getElementsByClassName('page-link');
	return pageLinks.length ? pageLinks[0] : rootElement.parentElement;
}

const pagination = props => {
	let markup;
	if (props.pages <= 1) {
		markup = (<Fragment/>);
	} else {
		const onClick = e => {
			const link = findLinkElement(e.target),
				disabled = link.hasAttribute('disabled'),
				page = Number(link.getAttribute('page'));
			!disabled && page !== props.page && props.onPageChanged(page);
		};
		markup = (
			<Pagination size="sm" className="float-right" onClick={onClick}>
			  {createButtons(props.page, props.pages)}
			</Pagination>
		);
	}
	return markup;
}

export default pagination;