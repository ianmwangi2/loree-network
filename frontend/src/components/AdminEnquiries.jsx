import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, X, Send, AlertCircle, CircleCheck, Mail } from 'lucide-react';

const TOPIC_LABELS = {
  PRODUCT_ENQUIRY: 'Product enquiry',
  QUOTE_REQUEST: 'Request a quote',
  TECHNICAL_SUPPORT: 'Technical support',
  INSTALLATION_BOOKING: 'Installation booking',
  PARTNERSHIP: 'Partnership / reseller',
  OTHER: 'Other'
};

export const AdminEnquiries = () => {
  const { enquiries, markEnquiryHandled, replyToEnquiry } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyAmount, setReplyAmount] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'new' && !enquiry.handled) ||
      (activeFilter === 'handled' && enquiry.handled);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      enquiry.name.toLowerCase().includes(query) ||
      enquiry.email.toLowerCase().includes(query) ||
      enquiry.message.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  const openReply = enquiry => {
    setReplyingTo(enquiry);
    setReplyMessage('');
    setReplyAmount('');
    setError('');
  };

  const handleSendReply = async e => {
    e.preventDefault();
    setError('');
    if (!replyMessage.trim()) {
      setError('Please write a message.');
      return;
    }
    setSending(true);
    try {
      await replyToEnquiry(replyingTo.id, {
        message: replyMessage,
        amount: replyAmount ? Number(replyAmount) : undefined
      });
      setReplyingTo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="adm-section">
      <div className="adm-toolbar">
        <div className="adm-search-wrap">
          <Search size={15} className="adm-search-ico" />
          <input
            className="adm-search"
            placeholder="Search enquiries…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="adm-filter-tabs">
          {[
            { id: 'all', label: 'All' },
            { id: 'new', label: 'New' },
            { id: 'handled', label: 'Handled' }
          ].map(filter => (
            <button
              key={filter.id}
              className={`adm-filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-panel">
        <table className="adm-table">
          <thead>
            <tr>
              <th>From</th>
              <th>Topic</th>
              <th>Service</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.map(enquiry => (
              <tr key={enquiry.id}>
                <td>
                  <div className="adm-cust-cell">
                    <span>{enquiry.name}</span>
                    <small>{enquiry.email}</small>
                  </div>
                </td>
                <td>
                  <span className="adm-cat-chip">{TOPIC_LABELS[enquiry.topic] || enquiry.topic}</span>
                </td>
                <td>{enquiry.service?.title || '—'}</td>
                <td className="adm-enq-message">{enquiry.message}</td>
                <td>
                  {new Date(enquiry.createdAt).toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td>
                  <span className={`adm-badge ${enquiry.handled ? 'adm-badge-delivered' : 'adm-badge-processing'}`}>
                    {enquiry.handled ? 'Handled' : 'New'}
                    {enquiry.replies?.length > 0 && ` · ${enquiry.replies.length} reply`}
                  </span>
                </td>
                <td>
                  <div className="adm-actions">
                    <button className="adm-act-btn adm-edit" onClick={() => openReply(enquiry)}>
                      <Mail size={14} />
                    </button>
                    {!enquiry.handled && (
                      <button
                        className="adm-act-btn"
                        onClick={() => markEnquiryHandled(enquiry.id, true)}
                        title="Mark handled"
                      >
                        <CircleCheck size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {replyingTo && (
        <div className="adm-modal-overlay" onClick={() => setReplyingTo(null)}>
          <form className="adm-modal" onClick={e => e.stopPropagation()} onSubmit={handleSendReply}>
            <div className="adm-modal-hd">
              <h3>Reply to {replyingTo.name}</h3>
              <button type="button" onClick={() => setReplyingTo(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-enq-original">
              <strong>{TOPIC_LABELS[replyingTo.topic] || replyingTo.topic}</strong>
              {replyingTo.service?.title && <span> · {replyingTo.service.title}</span>}
              <p>{replyingTo.message}</p>
            </div>

            {replyingTo.replies?.length > 0 && (
              <div className="adm-enq-replies">
                {replyingTo.replies.map(reply => (
                  <div className="adm-enq-reply" key={reply.id}>
                    {reply.amount != null && <strong>KSh {Number(reply.amount).toLocaleString()}</strong>}
                    <p>{reply.message}</p>
                    <small>{new Date(reply.createdAt).toLocaleString('en-KE')}</small>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="auth-error">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div className="adm-field">
              <label>Quote Amount (KSh, optional)</label>
              <input
                type="number"
                min="0"
                value={replyAmount}
                onChange={e => setReplyAmount(e.target.value)}
                placeholder="e.g. 45000"
              />
            </div>
            <div className="adm-field">
              <label>Message</label>
              <textarea
                rows={5}
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder="Write the quotation details or response…"
                required
              />
            </div>

            <div className="adm-modal-footer">
              <button type="button" className="adm-btn-cancel" onClick={() => setReplyingTo(null)}>
                Cancel
              </button>
              <button type="submit" className="adm-btn-save" disabled={sending}>
                <Send size={14} /> {sending ? 'Sending…' : 'Send Reply'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdminEnquiries;
