import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Todo from './Todo';


describe('<Todo />', () => {
  let mockCompleteHandler;
  let mockRemovalHandler;

  const TEST_TODO = {
    text: 'Test Todo xklfhruo1i234hn',
    done: false,
  }

  beforeEach(() => {
    mockCompleteHandler = jest.fn();
    mockRemovalHandler = jest.fn();
  });

  test('displays data correctly', async () => {
    render(
      <Todo 
        todo={TEST_TODO} 
        handleComplete={mockCompleteHandler}
        handleDelete={mockRemovalHandler}
      />
    )

    const todoText = await screen.findByText(TEST_TODO.text);
    const todoStatusText = await screen.findByText(`This todo is${TEST_TODO.done ? '' : ' not'} done`);

    expect(todoText).toBeDefined();
    expect(todoStatusText).toBeDefined();
  });

  test('event handlers get called', async () => {
    render(
      <Todo 
        todo={TEST_TODO} 
        handleComplete={mockCompleteHandler}
        handleDelete={mockRemovalHandler}
      />
    )

    const completeButton = await screen.findByText('Set as done');
    const deleteButton = await screen.findByText('Delete');

    userEvent.click(completeButton)
    userEvent.click(deleteButton)


    expect(mockCompleteHandler.mock.calls).toHaveLength(1);
    expect(mockRemovalHandler.mock.calls).toHaveLength(1);
  });
});