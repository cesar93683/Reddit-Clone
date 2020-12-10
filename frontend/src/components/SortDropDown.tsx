import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropDownProps {
  className?: string;
  disabled?: boolean;
  onSortByVotes: () => void;
  votesActive: boolean;
  onSortByDatePosted: () => void;
  datePostedActive: boolean;
}

export default function SortDropDown(props: SortDropDownProps) {
  const {
    className,
    disabled,
    onSortByVotes: sortByVotes,
    votesActive,
    onSortByDatePosted: sortByDatePosted,
    datePostedActive,
  } = props;
  return (
    <DropdownButton className={className} disabled={disabled} title="Sort By">
      <Dropdown.Item onClick={sortByVotes} active={votesActive}>
        Votes
      </Dropdown.Item>
      <Dropdown.Item onClick={sortByDatePosted} active={datePostedActive}>
        Date Posted
      </Dropdown.Item>
    </DropdownButton>
  );
}
