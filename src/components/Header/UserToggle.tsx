import './UserToggle.scss';

import { Dropdown, DropdownItem, DropdownList } from '@patternfly/react-core/dist/dynamic/components/Dropdown';
import { ITLess, getEnv, isProd as isProdEnv } from '../../utils/common';
import React, { useContext, useRef, useState } from 'react';
import { DEFAULT_SSO_ROUTES } from '../../utils/common';

import { Divider } from '@patternfly/react-core/dist/dynamic/components/Divider';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/dynamic/icons/ellipsis-v-icon';
import { MenuToggle } from '@patternfly/react-core/dist/dynamic/components/MenuToggle';
import QuestionCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/question-circle-icon';
import { Tooltip } from '@patternfly/react-core/dist/dynamic/components/Tooltip';
import classNames from 'classnames';
import messages from '../../locales/Messages';
import { useIntl } from 'react-intl';
import ChromeAuthContext from '../../auth/ChromeAuthContext';

const DropdownItems = ({
  username = '',
  isOrgAdmin,
  accountNumber,
  orgId,
  isInternal,
  extraItems = [],
}: {
  username?: string;
  isOrgAdmin?: boolean;
  accountNumber?: string;
  orgId?: string;
  isInternal?: boolean;
  extraItems?: React.ReactNode[];
}) => {
  const env = getEnv();
  const isProd = isProdEnv();
  const isITLessEnv = ITLess();
  const intl = useIntl();
  const prefix = isProd ? '' : `${env === 'ci' ? 'qa' : env}.`;
  const accountNumberTooltip = `${intl.formatMessage(messages.useAccountNumber)}`;
  const questionMarkRef = useRef(null);
  const { logout } = useContext(ChromeAuthContext);

  return [
    <DropdownItem key="Username" isDisabled>
      <dl className="chr-c-dropdown-item__stack">
        <dt className="chr-c-dropdown-item__stack--header">{intl.formatMessage(messages.username)}</dt>
        <dd className="chr-c-dropdown-item__stack--value data-hj-suppress sentry-mask">{username}</dd>
        {isOrgAdmin && <dd className="chr-c-dropdown-item__stack--subValue">{intl.formatMessage(messages.orgAdministrator)}</dd>}
      </dl>
    </DropdownItem>,
    <React.Fragment key="account wrapper">
      {accountNumber && (
        <Tooltip triggerRef={questionMarkRef} id="accountNumber-tooltip" content={accountNumberTooltip}>
          <DropdownItem component="span" key="Account" className="chr-c-disabled-pointer">
            <dl className="chr-c-dropdown-item__stack">
              {!isITLessEnv && (
                <>
                  <dt className="chr-c-dropdown-item__stack--header">
                    {intl.formatMessage(messages.accountNumber)}
                    <span ref={questionMarkRef} className="visible-pointer pf-v5-u-ml-sm">
                      <QuestionCircleIcon />
                    </span>
                  </dt>
                  <dd className="chr-c-dropdown-item__stack--value sentry-mask data-hj-suppress">{accountNumber}</dd>
                </>
              )}
              {isInternal && <dd className="chr-c-dropdown-item__stack--subValue">{intl.formatMessage(messages.internalUser)}</dd>}
            </dl>
          </DropdownItem>
        </Tooltip>
      )}
      {orgId && (
        <DropdownItem key="Org ID" isDisabled ouiaId="chrome-user-org-id">
          <dl className="chr-c-dropdown-item__stack">
            <dt className="chr-c-dropdown-item__stack--header">{intl.formatMessage(messages.orgId)}</dt>
            <dd className="chr-c-dropdown-item__stack--value">{orgId}</dd>
          </dl>
        </DropdownItem>
      )}
    </React.Fragment>,
    <Divider component="li" key="separator" />,
    <React.Fragment key="My Profile wrapper">
      {!isITLessEnv && (
        <DropdownItem
          key="My Profile"
          to={`${DEFAULT_SSO_ROUTES[env].portal}/user/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          component="a"
        >
          {intl.formatMessage(messages.myProfile)}
        </DropdownItem>
      )}
    </React.Fragment>,
    <DropdownItem key="logout" component="button" onClick={logout}>
      {intl.formatMessage(messages.logout)}
    </DropdownItem>,
    extraItems,
  ];
};

export type UserToggleProps = {
  isSmall?: boolean;
  extraItems?: React.ReactNode[];
};

const UserToggle = ({ isSmall = false, extraItems = [] }: UserToggleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    user: {
      identity: { user, account_number, internal },
    },
  } = useContext(ChromeAuthContext);
  const name = user?.first_name + ' ' + user?.last_name;

  const onSelect = (event: any) => {
    if (['A', 'BUTTON'].includes(event.target.tagName)) {
      setIsOpen(!isOpen);
    }
  };

  const onToggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <Dropdown
      popperProps={{
        position: 'right',
      }}
      aria-label="Overflow actions"
      ouiaId="chrome-user-menu"
      onSelect={onSelect}
      onOpenChange={setIsOpen}
      toggle={(toggleRef) => (
        <MenuToggle
          ref={toggleRef}
          isExpanded={isOpen}
          isFullHeight
          onClick={onToggle}
          variant={isSmall ? 'plain' : undefined}
          className={classNames('data-hj-suppress', 'sentry-mask', { 'pf-v5-u-pr-lg pf-v5-u-pl-lg': isSmall })}
          {...(isSmall && {
            id: 'UserMenu',
            'widget-type': 'UserMenu',
          })}
        >
          {isSmall ? <EllipsisVIcon /> : name}
        </MenuToggle>
      )}
      className="chr-c-dropdown-user-toggle"
      isOpen={isOpen}
    >
      <DropdownList>
        {/* Bad PF typings, child nodes can be used */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DropdownItems
          username={user?.username}
          isOrgAdmin={user?.is_org_admin}
          accountNumber={account_number}
          orgId={internal?.org_id}
          isInternal={user?.is_internal}
          extraItems={extraItems}
        />
      </DropdownList>
    </Dropdown>
  );
};

// TODO update this to use account_id
export default UserToggle;
