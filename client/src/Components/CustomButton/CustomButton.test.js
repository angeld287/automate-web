import { render } from '../../utils/test-utils';
import CustomButton from './index';

test('Verify correct renderization of CustomButton Component', () => {
    const { asFragment } = render(<CustomButton />);
    expect(asFragment()).toMatchSnapshot();
})