document.observe("dom:loaded", function() {
  new iPhoneStyle('input#variable_size_male_female', { checkedLabel: 'Female', uncheckedLabel: 'Male' });
  new iPhoneStyle('input#variable_size_a_b', { checkedLabel: 'A', uncheckedLabel: 'B' });
  new iPhoneStyle('input#static_size_a', { checkedLabel: '1', uncheckedLabel: '0', resizeContainer: false, resizeHandle: false });
  new iPhoneStyle('input#static_size_b', { checkedLabel: 'On', uncheckedLabel: 'Off', resizeContainer: false, resizeHandle: false });
  new iPhoneStyle('input#static_size_c', { checkedLabel: 'Override', uncheckedLabel: 'Default', resizeContainer: false, resizeHandle: false });
  new iPhoneStyle('input#draggable', { checkedLabel: 'Maybe you should drag me', uncheckedLabel: 'Weeeeeeeee', resizeHandle: false });
  new iPhoneStyle('input#sliding_labels', { checkedLabel: '<<<<<<<<<<<<<<<<<<<<<', uncheckedLabel: '>>>>>>>>>>>>>>>>>>>>>', resizeHandle: false });
});
