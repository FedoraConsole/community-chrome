import React from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.lg}>
        <EmptyStateHeader titleText="Fedora Open Services" headingLevel="h4" icon={<EmptyStateIcon icon={CubesIcon} />} />
        <EmptyStateBody>
          Welcome to Fedora Open Services, a full open source platform designed to empower you with innovative tools and services. Start by creating
          custom Fedora and CentOS images using our Image Builder service, tailored to your unique needs. And this is just the beginning—more services
          are on the horizon to enhance your experience and expand your possibilities.
        </EmptyStateBody>
        <EmptyStateFooter>
          <EmptyStateActions>
            <Button onClick={() => navigate('/insights/image-builder')} variant="primary">
              Image builder
            </Button>
          </EmptyStateActions>
        </EmptyStateFooter>
      </EmptyState>
    </Bullseye>
  );
};

export default LandingPage;
