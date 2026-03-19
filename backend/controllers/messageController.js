const Message = require('../models/Message');
const Project = require('../models/Project');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key_to_prevent_crash_replace_with_real' // user must provide
});

// @desc    Get messages for a project
// @route   GET /api/projects/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ project: req.params.id }).populate('senderId', 'name').sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/projects/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Determine sender type based on role
    const senderType = req.user.role === 'admin' ? 'admin' : 'user';

    // Save actual user message
    const message = await Message.create({
      project: projectId,
      senderType,
      senderId: req.user._id,
      text
    });

    const messagesToReturn = [message];

    // Auto-reply logic (if user sends message, and no admin is actively typing - we use Groq to reply optionally)
    // To demonstrate the requirement: "use groq api to chat auto with the user when admin is offline"
    // We'll automatically trigger Groq for regular 'user' messages
    if (senderType === 'user' && process.env.GROQ_API_KEY) {
      try {
        const pastMessages = await Message.find({ project: projectId }).sort({ createdAt: 1 }).limit(10);
        
        const conversationHistory = pastMessages.map(msg => ({
          role: msg.senderType === 'bot' || msg.senderType === 'admin' ? 'assistant' : 'user',
          content: msg.text
        }));

        const systemPrompt = `You are the primary admin assistant for ProjectBuddy. 
The user's project is: "${project.title}". 
Description: "${project.description}". 
Domain: ${project.domain}. 
Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}.
Status: ${project.status}.

Be extremely helpful, polite, and reassuring. Act like a highly advanced AI that analyzes their project. Confirm that the team is actively reviewing their requirements. Always maintain an encouraging and professional tone.`;

        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.6,
          max_tokens: 300
        });

        const replyContent = completion.choices[0]?.message?.content;
        
        const botReply = (replyContent && replyContent.trim().length > 0) 
          ? replyContent 
          : "Thanks for contacting! We will review your project and answer shortly. Please let us know if you need any other immediate help with the details.";

        const botMessage = await Message.create({
          project: projectId,
          senderType: 'bot',
          text: botReply
        });

        messagesToReturn.push(botMessage);
      } catch (err) {
        console.error('Groq API Error:', err.message);
        // Fallback bot message if Groq fails or offline
        const fallbackMsg = await Message.create({
          project: projectId,
          senderType: 'bot',
          text: "Thanks for contacting! We will review your project and answer shortly. My AI link is currently syncing, but an admin will assist you soon."
        });
        messagesToReturn.push(fallbackMsg);
      }
    }

    res.status(201).json(messagesToReturn);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  sendMessage
};
